"use server";

import { USER_ROLES, type UserRole } from "@/lib/auth/constants";
import { canManageUsers } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type AddUserInput = {
    fullName: string;
    email: string;
    role: string;
};

type AddUserResult = {
    success: boolean;
    message: string;
    fieldErrors?: {
        fullName?: string;
        email?: string;
        role?: string;
    };
};

export type ChangeUserRoleActionState = {
    success: boolean;
    message: string;
};

export async function addUserAction(
    input: AddUserInput,
): Promise<AddUserResult> {
    const supabase = await createClient();

    // 1. Get current authenticated user
    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn.",
        };
    }

    // 2. Get current user's profile
    const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("restaurant_id, role")
        .eq("id", currentUser.id)
        .single();

    if (profileError || !currentProfile) {
        console.error("Failed to get current user profile:", profileError);

        return {
            success: false,
            message: "Không thể xác định thông tin người dùng.",
        };
    }

    // 3. Only Owner can add users
    if (!canManageUsers(currentProfile.role)) {
        return {
            success: false,
            message: "Bạn không có quyền thêm người dùng.",
        };
    }

    const fullName = input.fullName.trim();
    const email = input.email.trim().toLowerCase();
    const role = input.role;

    // 4. Validate input on server
    if (!fullName) {
        return {
            success: false,
            message: "Vui lòng kiểm tra thông tin.",
            fieldErrors: {
                fullName: "Vui lòng nhập tên.",
            },
        };
    }

    if (!email) {
        return {
            success: false,
            message: "Vui lòng kiểm tra thông tin.",
            fieldErrors: {
                email: "Vui lòng nhập email.",
            },
        };
    }

    if (role !== USER_ROLES.MANAGER && role !== USER_ROLES.STAFF) {
        return {
            success: false,
            message: "Role không hợp lệ.",
            fieldErrors: {
                role: "Vui lòng chọn role hợp lệ.",
            },
        };
    }

    // 5. Create Supabase Auth user
    // Email invitation / OTP will be implemented in a later feature.
    const adminSupabase = createAdminClient();

    const { data: authData, error: authError } =
        await adminSupabase.auth.admin.createUser({
            email,
            email_confirm: false,
            user_metadata: {
                full_name: fullName,
            },
        });

    if (authError || !authData.user) {
        console.error("Failed to create user:", {
            error: authError,
            message: authError?.message,
            status: authError?.status,
        });

        return {
            success: false,
            message: "Không thể thêm người dùng.",
            fieldErrors: {
                email:
                    authError?.message ||
                    "Không thể tạo tài khoản với email này.",
            },
        };
    }

    const newUser = authData.user;

    // 6. Create profile
    const { error: newProfileError } = await adminSupabase
        .from("profiles")
        .insert({
            id: newUser.id,
            restaurant_id: currentProfile.restaurant_id,
            full_name: fullName,
            role,
        });

    if (newProfileError) {
        console.error("Failed to create user profile:", newProfileError);

        // Roll back Auth user if profile creation fails.
        const { error: deleteUserError } =
            await adminSupabase.auth.admin.deleteUser(newUser.id);

        if (deleteUserError) {
            console.error("Failed to rollback Auth user:", deleteUserError);
        }

        return {
            success: false,
            message: "Không thể tạo thông tin người dùng. Vui lòng thử lại.",
        };
    }

    return {
        success: true,
        message: "Đã thêm người dùng thành công.",
    };
}

export async function deleteUserAction(userId: string): Promise<{
    success: boolean;
    message: string;
}> {
    const supabase = await createClient();

    // 1. Get current authenticated user
    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn.",
        };
    }

    // 2. Get current user's profile
    const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("restaurant_id, role")
        .eq("id", currentUser.id)
        .single();

    if (profileError || !currentProfile) {
        console.error("Failed to get current user profile:", profileError);

        return {
            success: false,
            message: "Không thể xác định thông tin người dùng.",
        };
    }

    // 3. Only Owner can delete users
    if (!canManageUsers(currentProfile.role)) {
        return {
            success: false,
            message: "Bạn không có quyền xóa người dùng.",
        };
    }

    // 4. Owner cannot delete himself
    if (userId === currentUser.id) {
        return {
            success: false,
            message: "Bạn không thể xóa tài khoản của chính mình.",
        };
    }

    const adminSupabase = createAdminClient();

    // 5. Get target user's profile
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
            message: "Không tìm thấy người dùng.",
        };
    }

    // 6. Target user must belong to the same restaurant
    if (targetProfile.restaurant_id !== currentProfile.restaurant_id) {
        return {
            success: false,
            message: "Bạn không có quyền xóa người dùng này.",
        };
    }

    // 7. Owner cannot be deleted
    if (targetProfile.role === USER_ROLES.OWNER) {
        return {
            success: false,
            message: "Không thể xóa tài khoản Owner.",
        };
    }

    // 8. Delete profile
    const { error: deleteProfileError } = await adminSupabase
        .from("profiles")
        .delete()
        .eq("id", userId)
        .eq("restaurant_id", currentProfile.restaurant_id);

    if (deleteProfileError) {
        console.error("Failed to delete user profile:", deleteProfileError);

        return {
            success: false,
            message: "Không thể xóa thông tin người dùng. Vui lòng thử lại.",
        };
    }

    // 9. Delete Auth user
    const { error: deleteAuthUserError } =
        await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteAuthUserError) {
        console.error("Failed to delete auth user:", deleteAuthUserError);

        // Rollback profile if Auth deletion failed
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
            message: "Không thể xóa tài khoản người dùng. Vui lòng thử lại.",
        };
    }

    return {
        success: true,
        message: "Đã xóa người dùng thành công.",
    };
}

export async function changeUserRoleAction(
    _previousState: ChangeUserRoleActionState,
    formData: FormData,
): Promise<ChangeUserRoleActionState> {
    const supabase = await createClient();

    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn.",
        };
    }

    const { data: currentProfile, error: currentProfileError } = await supabase
        .from("profiles")
        .select("restaurant_id, role")
        .eq("id", currentUser.id)
        .single();

    if (currentProfileError || !currentProfile) {
        return {
            success: false,
            message: "Không thể xác định thông tin người dùng.",
        };
    }

    if (!canManageUsers(currentProfile.role)) {
        return {
            success: false,
            message: "Bạn không có quyền thay đổi vai trò.",
        };
    }

    const userId = String(formData.get("userId") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim() as UserRole;

    if (!userId) {
        return {
            success: false,
            message: "Không tìm thấy người dùng cần cập nhật.",
        };
    }

    if (role !== USER_ROLES.MANAGER && role !== USER_ROLES.STAFF) {
        return {
            success: false,
            message: "Vai trò không hợp lệ.",
        };
    }

    if (userId === currentUser.id) {
        return {
            success: false,
            message: "Bạn không thể thay đổi vai trò của chính mình.",
        };
    }

    const adminSupabase = createAdminClient();

    const { data: targetProfile, error: targetProfileError } =
        await adminSupabase
            .from("profiles")
            .select("id, restaurant_id, role")
            .eq("id", userId)
            .single();

    if (targetProfileError || !targetProfile) {
        return {
            success: false,
            message: "Không tìm thấy người dùng.",
        };
    }

    if (targetProfile.restaurant_id !== currentProfile.restaurant_id) {
        return {
            success: false,
            message: "Bạn không có quyền thay đổi người dùng này.",
        };
    }

    if (targetProfile.role === USER_ROLES.OWNER) {
        return {
            success: false,
            message: "Không thể thay đổi vai trò của Owner.",
        };
    }

    if (targetProfile.role === role) {
        return {
            success: true,
            message: "Vai trò không có thay đổi.",
        };
    }

    const { error: updateError } = await adminSupabase
        .from("profiles")
        .update({
            role,
        })
        .eq("id", userId)
        .eq("restaurant_id", currentProfile.restaurant_id);

    if (updateError) {
        console.error("Failed to update user role:", updateError);

        return {
            success: false,
            message: "Không thể cập nhật vai trò. Vui lòng thử lại.",
        };
    }

    revalidatePath("/dashboard/users-roles");

    return {
        success: true,
        message: "Đã cập nhật vai trò thành công.",
    };
}
