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

export type ProfileData = {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
};

type ProfileActionResult = {
    success: boolean;
    message: string;
    profile?: ProfileData;
    fieldErrors?: {
        fullName?: string;
        avatar?: string;
    };
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

export async function getProfileAction(): Promise<ProfileActionResult> {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url")
        .eq("id", user.id)
        .single();

    if (error || !profile) {
        console.error("Failed to get profile:", error);

        return {
            success: false,
            message: "Không thể tải thông tin hồ sơ.",
        };
    }

    return {
        success: true,
        message: "Đã tải thông tin hồ sơ.",
        profile: {
            id: profile.id,
            fullName: profile.full_name ?? "",
            email: user.email ?? "",
            role: profile.role,
            avatarUrl: profile.avatar_url,
        },
    };
}

export async function updateProfileAction(input: {
    fullName: string;
    avatar?: File | null;
}): Promise<ProfileActionResult> {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
    }

    const fullName = input.fullName.trim();
    const avatarFile = input.avatar;

    if (!fullName || fullName.length > 100) {
        return {
            success: false,
            message: "Vui lòng kiểm tra thông tin.",
            fieldErrors: {
                fullName: "Tên phải có từ 1 đến 100 ký tự.",
            },
        };
    }

    if (avatarFile) {
        if (
            !Object.prototype.hasOwnProperty.call(
                ALLOWED_AVATAR_TYPES,
                avatarFile.type,
            )
        ) {
            return {
                success: false,
                message: "Định dạng avatar không hợp lệ.",
                fieldErrors: {
                    avatar: "Chỉ chấp nhận ảnh PNG, JPEG hoặc WebP.",
                },
            };
        }

        if (avatarFile.size === 0 || avatarFile.size > MAX_AVATAR_SIZE) {
            return {
                success: false,
                message: "Dung lượng avatar không hợp lệ.",
                fieldErrors: {
                    avatar: "Ảnh phải có dung lượng tối đa 1 MB.",
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
            message: "Không thể xác định thông tin hồ sơ.",
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
                    message: "Không thể tải avatar lên. Vui lòng thử lại.",
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

            if (newAvatarPath) {
                await admin.storage
                    .from("profile-avatars")
                    .remove([newAvatarPath]);
            }

            return {
                success: false,
                message: "Không thể lưu hồ sơ. Vui lòng thử lại.",
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

        const result = await getProfileAction();

        return {
            success: true,
            message: "Đã cập nhật hồ sơ thành công.",
            profile: result.profile,
        };
    } catch (error) {
        console.error("Unexpected profile update error:", error);

        if (newAvatarPath) {
            await admin.storage.from("profile-avatars").remove([newAvatarPath]);
        }

        return {
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật hồ sơ.",
        };
    }
}
