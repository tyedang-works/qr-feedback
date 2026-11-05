"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { translations, type Locale } from "@/i18n/translations";
import { USER_ROLES } from "@/lib/auth/constants";
import { canManageUsers } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type UsersRolesMessages = {
    [Key in keyof typeof translations.vi.usersRoles]: string;
};

async function getUsersRolesMessages(): Promise<UsersRolesMessages> {
    const cookieStore = await cookies();

    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    return translations[locale].usersRoles;
}

type AddUserInput = {
    fullName: string;
    email: string;
    role: string;
    password: string;
    avatar?: File | null;
};

type AddUserResult = {
    success: boolean;
    message: string;
    fieldErrors?: {
        fullName?: string;
        email?: string;
        role?: string;
        password?: string;
    };
};

function getAuthErrorMessage(
    message: string | undefined,
    messages: UsersRolesMessages,
): string {
    if (!message) {
        return messages["action.authCreateFallback"];
    }

    const normalizedMessage = message.toLowerCase();

    if (
        normalizedMessage.includes("already been registered") ||
        normalizedMessage.includes("already exists") ||
        normalizedMessage.includes("user already registered")
    ) {
        return messages["action.emailAlreadyRegistered"];
    }

    if (
        normalizedMessage.includes("invalid email") ||
        normalizedMessage.includes("email address is invalid")
    ) {
        return messages["action.invalidEmail"];
    }

    if (normalizedMessage.includes("password")) {
        return messages["action.invalidPassword"];
    }

    if (
        normalizedMessage.includes("rate limit") ||
        normalizedMessage.includes("too many requests")
    ) {
        return messages["action.tooManyRequests"];
    }

    return messages["action.authCreateFallback"];
}

const MAX_AVATAR_SIZE = 1024 * 1024;

const ALLOWED_AVATAR_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
} as const;

export async function addUserAction(
    input: AddUserInput,
): Promise<AddUserResult> {
    const messages = await getUsersRolesMessages();

    const supabase = await createClient();

    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return {
            success: false,
            message: messages["action.sessionExpired"],
        };
    }

    const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("restaurant_id, role")
        .eq("id", currentUser.id)
        .single();

    if (profileError || !currentProfile) {
        console.error("Failed to get current user profile:", profileError);

        return {
            success: false,
            message: messages["action.userContextError"],
        };
    }

    if (!canManageUsers(currentProfile.role)) {
        return {
            success: false,
            message: messages["action.addPermissionDenied"],
        };
    }

    const fullName = input.fullName.trim();
    const email = input.email.trim().toLowerCase();
    const { password } = input;
    const role = input.role;
    const avatar = input.avatar ?? null;

    const fieldErrors: NonNullable<AddUserResult["fieldErrors"]> = {};

    if (!fullName || fullName.length > 100) {
        fieldErrors.fullName = messages["action.fullNameValidation"];
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        fieldErrors.email = messages["action.invalidEmail"];
    }

    if (role !== USER_ROLES.MANAGER && role !== USER_ROLES.STAFF) {
        fieldErrors.role = messages["action.invalidRole"];
    }

    if (password.length < 8 || password.length > 72) {
        fieldErrors.password = messages["action.passwordLength"];
    }

    if (Object.keys(fieldErrors).length > 0) {
        return {
            success: false,
            message: messages["action.checkInformation"],
            fieldErrors,
        };
    }

    if (avatar) {
        if (!(avatar.type in ALLOWED_AVATAR_TYPES)) {
            return {
                success: false,
                message: messages["action.avatarFormatError"],
            };
        }

        if (avatar.size > MAX_AVATAR_SIZE) {
            return {
                success: false,
                message: messages["action.avatarSizeError"],
            };
        }
    }

    const adminSupabase = createAdminClient();

    const { data: authData, error: authError } =
        await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
            },
        });

    if (authError || !authData.user) {
        console.error("Failed to create user:", authError);

        return {
            success: false,
            message: messages["action.addUserFailed"],
            fieldErrors: {
                email: getAuthErrorMessage(authError?.message, messages),
            },
        };
    }

    const newUser = authData.user;
    let uploadedAvatarPath: string | null = null;

    const rollbackNewUser = async () => {
        if (uploadedAvatarPath) {
            const { error: avatarRemoveError } = await adminSupabase.storage
                .from("profile-avatars")
                .remove([uploadedAvatarPath]);

            if (avatarRemoveError) {
                console.error("Failed to rollback avatar:", avatarRemoveError);
            }
        }

        const { error: profileDeleteError } = await adminSupabase
            .from("profiles")
            .delete()
            .eq("id", newUser.id)
            .eq("restaurant_id", currentProfile.restaurant_id);

        if (profileDeleteError) {
            console.error(
                "Failed to rollback user profile:",
                profileDeleteError,
            );
        }

        const { error: authDeleteError } =
            await adminSupabase.auth.admin.deleteUser(newUser.id);

        if (authDeleteError) {
            console.error("Failed to rollback Auth user:", authDeleteError);
        }
    };

    const { error: profileInsertError } = await adminSupabase
        .from("profiles")
        .insert({
            id: newUser.id,
            restaurant_id: currentProfile.restaurant_id,
            full_name: fullName,
            role,
            avatar_url: null,
        });

    if (profileInsertError) {
        console.error("Failed to create user profile:", profileInsertError);

        await rollbackNewUser();

        return {
            success: false,
            message: messages["action.profileCreateFailed"],
        };
    }

    if (avatar) {
        const extension =
            ALLOWED_AVATAR_TYPES[
                avatar.type as keyof typeof ALLOWED_AVATAR_TYPES
            ];

        uploadedAvatarPath = `${currentProfile.restaurant_id}/${newUser.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await adminSupabase.storage
            .from("profile-avatars")
            .upload(uploadedAvatarPath, avatar, {
                contentType: avatar.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Failed to upload avatar:", uploadError);

            await rollbackNewUser();

            return {
                success: false,
                message: messages["action.avatarUploadFailed"],
            };
        }

        const { data: publicUrlData } = adminSupabase.storage
            .from("profile-avatars")
            .getPublicUrl(uploadedAvatarPath);

        const { error: avatarUpdateError } = await adminSupabase
            .from("profiles")
            .update({
                avatar_url: publicUrlData.publicUrl,
            })
            .eq("id", newUser.id)
            .eq("restaurant_id", currentProfile.restaurant_id);

        if (avatarUpdateError) {
            console.error("Failed to save avatar URL:", avatarUpdateError);

            await rollbackNewUser();

            return {
                success: false,
                message: messages["action.avatarSaveFailed"],
            };
        }
    }

    revalidatePath("/dashboard/users-roles");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: messages["action.addSuccess"],
    };
}

export async function deleteUserAction(userId: string): Promise<{
    success: boolean;
    message: string;
}> {
    const messages = await getUsersRolesMessages();

    const supabase = await createClient();

    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return {
            success: false,
            message: messages["action.sessionExpired"],
        };
    }

    const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("restaurant_id, role")
        .eq("id", currentUser.id)
        .single();

    if (profileError || !currentProfile) {
        console.error("Failed to get current user profile:", profileError);

        return {
            success: false,
            message: messages["action.userContextError"],
        };
    }

    if (!canManageUsers(currentProfile.role)) {
        return {
            success: false,
            message: messages["action.deletePermissionDenied"],
        };
    }

    if (userId === currentUser.id) {
        return {
            success: false,
            message: messages["action.cannotDeleteSelf"],
        };
    }

    const adminSupabase = createAdminClient();

    const { data: targetProfile, error: targetProfileError } =
        await adminSupabase
            .from("profiles")
            .select("id, restaurant_id, full_name, role")
            .eq("id", userId)
            .single();

    if (targetProfileError || !targetProfile) {
        console.error("Failed to get target user profile:", targetProfileError);

        return {
            success: false,
            message: messages["action.userNotFound"],
        };
    }

    if (targetProfile.restaurant_id !== currentProfile.restaurant_id) {
        return {
            success: false,
            message: messages["action.deleteTargetPermissionDenied"],
        };
    }

    if (targetProfile.role === USER_ROLES.OWNER) {
        return {
            success: false,
            message: messages["action.cannotDeleteOwner"],
        };
    }

    const { error: deleteProfileError } = await adminSupabase
        .from("profiles")
        .delete()
        .eq("id", userId)
        .eq("restaurant_id", currentProfile.restaurant_id);

    if (deleteProfileError) {
        console.error("Failed to delete user profile:", deleteProfileError);

        return {
            success: false,
            message: messages["action.deleteProfileFailed"],
        };
    }

    const { error: deleteAuthUserError } =
        await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteAuthUserError) {
        console.error("Failed to delete auth user:", deleteAuthUserError);

        const { error: rollbackError } = await adminSupabase
            .from("profiles")
            .insert({
                id: targetProfile.id,
                restaurant_id: targetProfile.restaurant_id,
                full_name: targetProfile.full_name,
                role: targetProfile.role,
            });

        if (rollbackError) {
            console.error("Failed to rollback deleted profile:", rollbackError);
        }

        return {
            success: false,
            message: messages["action.deleteAuthFailed"],
        };
    }

    return {
        success: true,
        message: messages["action.deleteSuccess"],
    };
}

type UpdateUserInput = {
    userId: string;
    fullName: string;
    role: string;
    avatar?: File | null;
};

type UpdateUserResult = {
    success: boolean;
    message: string;
    avatarUrl?: string | null;
    fieldErrors?: {
        fullName?: string;
        role?: string;
    };
};

export async function updateUserAction(
    input: UpdateUserInput,
): Promise<UpdateUserResult> {
    const messages = await getUsersRolesMessages();

    const supabase = await createClient();

    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return {
            success: false,
            message: messages["action.sessionExpired"],
        };
    }

    const { data: currentProfile, error: currentProfileError } = await supabase
        .from("profiles")
        .select("restaurant_id, role")
        .eq("id", currentUser.id)
        .single();

    if (currentProfileError || !currentProfile) {
        console.error(
            "Failed to get current user profile:",
            currentProfileError,
        );

        return {
            success: false,
            message: messages["action.userContextError"],
        };
    }

    if (!canManageUsers(currentProfile.role)) {
        return {
            success: false,
            message: messages["action.editPermissionDenied"],
        };
    }

    const userId = input.userId.trim();
    const fullName = input.fullName.trim();
    const role = input.role;
    const avatar = input.avatar ?? null;

    const fieldErrors: NonNullable<UpdateUserResult["fieldErrors"]> = {};

    if (!userId) {
        return {
            success: false,
            message: messages["action.userIdRequired"],
        };
    }

    if (!fullName || fullName.length > 100) {
        fieldErrors.fullName = messages["action.fullNameValidation"];
    }

    if (role !== USER_ROLES.MANAGER && role !== USER_ROLES.STAFF) {
        fieldErrors.role = messages["action.invalidRole"];
    }

    if (Object.keys(fieldErrors).length > 0) {
        return {
            success: false,
            message: messages["action.checkInformation"],
            fieldErrors,
        };
    }

    if (avatar && !(avatar.type in ALLOWED_AVATAR_TYPES)) {
        return {
            success: false,
            message: messages["action.avatarFormatError"],
        };
    }

    if (avatar && avatar.size > MAX_AVATAR_SIZE) {
        return {
            success: false,
            message: messages["action.avatarSizeError"],
        };
    }

    const adminSupabase = createAdminClient();

    const { data: targetProfile, error: targetProfileError } =
        await adminSupabase
            .from("profiles")
            .select("id, restaurant_id, role, avatar_url")
            .eq("id", userId)
            .single();

    if (targetProfileError || !targetProfile) {
        return {
            success: false,
            message: messages["action.userNotFound"],
        };
    }

    if (targetProfile.restaurant_id !== currentProfile.restaurant_id) {
        return {
            success: false,
            message: messages["action.editTargetPermissionDenied"],
        };
    }

    if (targetProfile.role === USER_ROLES.OWNER) {
        return {
            success: false,
            message: messages["action.cannotEditOwner"],
        };
    }

    let uploadedAvatarPath: string | null = null;
    let nextAvatarUrl = targetProfile.avatar_url;

    if (avatar) {
        const extension =
            ALLOWED_AVATAR_TYPES[
                avatar.type as keyof typeof ALLOWED_AVATAR_TYPES
            ];

        uploadedAvatarPath =
            `${currentProfile.restaurant_id}/${userId}/` +
            `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await adminSupabase.storage
            .from("profile-avatars")
            .upload(uploadedAvatarPath, avatar, {
                contentType: avatar.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Failed to upload avatar:", uploadError);

            return {
                success: false,
                message: messages["action.avatarUploadFailed"],
            };
        }

        const { data: publicUrlData } = adminSupabase.storage
            .from("profile-avatars")
            .getPublicUrl(uploadedAvatarPath);

        nextAvatarUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await adminSupabase
        .from("profiles")
        .update({
            full_name: fullName,
            role,
            avatar_url: nextAvatarUrl,
        })
        .eq("id", userId)
        .eq("restaurant_id", currentProfile.restaurant_id);

    if (updateError) {
        if (uploadedAvatarPath) {
            const { error: cleanupError } = await adminSupabase.storage
                .from("profile-avatars")
                .remove([uploadedAvatarPath]);

            if (cleanupError) {
                console.error(
                    "Failed to clean up uploaded avatar:",
                    cleanupError,
                );
            }
        }

        return {
            success: false,
            message: messages["action.updateUserFailed"],
        };
    }

    if (avatar && targetProfile.avatar_url) {
        const publicUrlPrefix = "/storage/v1/object/public/profile-avatars/";

        const oldAvatarPath = targetProfile.avatar_url.includes(publicUrlPrefix)
            ? targetProfile.avatar_url.split(publicUrlPrefix)[1]?.split("?")[0]
            : null;

        if (
            oldAvatarPath &&
            oldAvatarPath.startsWith(
                `${currentProfile.restaurant_id}/${userId}/`,
            )
        ) {
            const { error: removeOldAvatarError } = await adminSupabase.storage
                .from("profile-avatars")
                .remove([decodeURIComponent(oldAvatarPath)]);

            if (removeOldAvatarError) {
                console.error(
                    "Failed to remove old avatar:",
                    removeOldAvatarError,
                );
            }
        }
    }

    revalidatePath("/dashboard/users-roles");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: messages["action.updateSuccess"],
        avatarUrl: nextAvatarUrl,
    };
}
