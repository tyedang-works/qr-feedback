"use server";

import { UserRole } from "@/lib/auth/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_AVATAR_SIZE = 1024 * 1024;

const ALLOWED_AVATAR_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
} as const;

type ProfileMessageKey =
    | "sessionExpired"
    | "profileLoadError"
    | "profileLoaded"
    | "invalidProfile"
    | "invalidAvatarType"
    | "avatarMaxSize"
    | "avatarUploadError"
    | "profileUpdateError"
    | "profileUpdateSuccess"
    | "unexpectedError";

type ProfileFieldErrorKey =
    | "fullNameRequired"
    | "fullNameMaxLength"
    | "invalidAvatarType"
    | "avatarMaxSize";

export type ProfileData = {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
};

type ProfileActionResult = {
    success: boolean;
    messageKey: ProfileMessageKey;
    profile?: ProfileData;
    fieldErrors?: {
        fullName?: ProfileFieldErrorKey;
        avatar?: ProfileFieldErrorKey;
    };
};

type ProfileRow = {
    id: string;
    full_name: string | null;
    role: UserRole;
    avatar_url: string | null;
};

function getOwnedAvatarPath(
    avatarUrl: string | null,
    userId: string,
): string | null {
    if (!avatarUrl || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return null;
    }

    try {
        const avatar = new URL(avatarUrl);
        const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);

        const prefix = "/storage/v1/object/public/profile-avatars/";

        if (
            avatar.origin !== base.origin ||
            !avatar.pathname.startsWith(prefix)
        ) {
            return null;
        }

        const path = decodeURIComponent(avatar.pathname.slice(prefix.length));

        return path.startsWith(`${userId}/`) ? path : null;
    } catch {
        return null;
    }
}

async function getAuthenticatedUser() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return { supabase, user };
}

function mapProfile(profile: ProfileRow, email: string): ProfileData {
    return {
        id: profile.id,
        fullName: profile.full_name ?? "",
        email,
        role: profile.role,
        avatarUrl: profile.avatar_url,
    };
}

async function removeUploadedAvatar(path: string | null) {
    if (!path) return;

    try {
        const admin = createAdminClient();

        const { error } = await admin.storage
            .from("profile-avatars")
            .remove([path]);

        if (error) {
            console.error("Failed to remove uploaded avatar:", error);
        }
    } catch (error) {
        console.error("Unexpected error removing uploaded avatar:", error);
    }
}

export async function getProfileAction(): Promise<ProfileActionResult> {
    const auth = await getAuthenticatedUser();

    if (!auth) {
        return {
            success: false,
            messageKey: "sessionExpired",
        };
    }

    const { supabase, user } = auth;

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url")
        .eq("id", user.id)
        .single();

    if (error || !profile) {
        console.error("Failed to get profile:", error);

        return {
            success: false,
            messageKey: "profileLoadError",
        };
    }

    return {
        success: true,
        messageKey: "profileLoaded",
        profile: mapProfile(profile as ProfileRow, user.email ?? ""),
    };
}

export async function updateProfileAction(input: {
    fullName: string;
    avatar?: File | null;
}): Promise<ProfileActionResult> {
    const auth = await getAuthenticatedUser();

    if (!auth) {
        return {
            success: false,
            messageKey: "sessionExpired",
        };
    }

    const { supabase, user } = auth;

    const fullName = input.fullName?.trim() ?? "";

    if (!fullName) {
        return {
            success: false,
            messageKey: "invalidProfile",
            fieldErrors: {
                fullName: "fullNameRequired",
            },
        };
    }

    if (fullName.length > 100) {
        return {
            success: false,
            messageKey: "invalidProfile",
            fieldErrors: {
                fullName: "fullNameMaxLength",
            },
        };
    }
    const avatarFile = input.avatar;

    if (avatarFile) {
        if (
            !Object.prototype.hasOwnProperty.call(
                ALLOWED_AVATAR_TYPES,
                avatarFile.type,
            )
        ) {
            return {
                success: false,
                messageKey: "invalidAvatarType",
                fieldErrors: {
                    avatar: "invalidAvatarType",
                },
            };
        }

        if (avatarFile.size === 0 || avatarFile.size > MAX_AVATAR_SIZE) {
            return {
                success: false,
                messageKey: "avatarMaxSize",
                fieldErrors: {
                    avatar: "avatarMaxSize",
                },
            };
        }
    }

    const { data: currentProfile, error: currentProfileError } = await supabase
        .from("profiles")
        .select("id, avatar_url")
        .eq("id", user.id)
        .single();

    if (currentProfileError || !currentProfile) {
        console.error("Failed to get current profile:", currentProfileError);

        return {
            success: false,
            messageKey: "profileLoadError",
        };
    }

    const admin = createAdminClient();

    const oldAvatarPath = getOwnedAvatarPath(
        currentProfile.avatar_url,
        user.id,
    );

    let newAvatarPath: string | null = null;
    let newAvatarUrl: string | null = null;

    try {
        if (avatarFile) {
            const extension =
                ALLOWED_AVATAR_TYPES[
                    avatarFile.type as keyof typeof ALLOWED_AVATAR_TYPES
                ];

            newAvatarPath = `${user.id}/${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await admin.storage
                .from("profile-avatars")
                .upload(newAvatarPath, avatarFile, {
                    contentType: avatarFile.type,
                    upsert: false,
                });

            if (uploadError) {
                console.error("Failed to upload profile avatar:", uploadError);

                return {
                    success: false,
                    messageKey: "avatarUploadError",
                };
            }

            const { data } = admin.storage
                .from("profile-avatars")
                .getPublicUrl(newAvatarPath);

            newAvatarUrl = data.publicUrl;
        }

        const updateData: {
            full_name: string;
            avatar_url?: string;
        } = {
            full_name: fullName,
        };

        if (newAvatarUrl) {
            updateData.avatar_url = newAvatarUrl;
        }

        const { error: updateError } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", user.id);

        if (updateError) {
            console.error("Failed to update profile:", updateError);

            await removeUploadedAvatar(newAvatarPath);

            return {
                success: false,
                messageKey: "profileUpdateError",
            };
        }
        const { data: updatedProfile, error: updatedProfileError } =
            await supabase
                .from("profiles")
                .select("id, full_name, role, avatar_url")
                .eq("id", user.id)
                .single();

        if (updatedProfileError || !updatedProfile) {
            console.error(
                "Failed to retrieve updated profile:",
                updatedProfileError,
            );
            revalidatePath("/dashboard/profile");
            revalidatePath("/dashboard");

            return {
                success: true,
                messageKey: "profileUpdateSuccess",
            };
        }

        if (newAvatarPath && oldAvatarPath) {
            const { error: removeError } = await admin.storage
                .from("profile-avatars")
                .remove([oldAvatarPath]);

            if (removeError) {
                console.error("Failed to remove old avatar:", removeError);
            }
        }

        revalidatePath("/dashboard/profile");
        revalidatePath("/dashboard");

        return {
            success: true,
            messageKey: "profileUpdateSuccess",
            profile: mapProfile(updatedProfile as ProfileRow, user.email ?? ""),
        };
    } catch (error) {
        console.error("Unexpected profile update error:", error);

        await removeUploadedAvatar(newAvatarPath);

        return {
            success: false,
            messageKey: "unexpectedError",
        };
    }
}
