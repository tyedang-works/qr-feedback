"use server";

import { revalidatePath } from "next/cache";
import { canManageSettings } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import { createAdminClient } from "@/lib/supabase/admin";

export type BrandingType = "logo" | "favicon";

type BrandingActionResult =
    | { success: true; message: string; url: string }
    | { success: false; message: string };

const BUCKET_NAME = "restaurant-branding";
const MAX_FILE_SIZE = 1024 * 1024;

type BrandingExtension = "png" | "jpg" | "webp" | "ico";

const ALLOWED_TYPES: Record<string, BrandingExtension> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/x-icon": "ico",
    "image/vnd.microsoft.icon": "ico",
};

function isBrandingType(value: string): value is BrandingType {
    return value === "logo" || value === "favicon";
}

export async function uploadRestaurantBranding(
    formData: FormData,
): Promise<BrandingActionResult> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Không tìm thấy thông tin tài khoản.",
        };
    }

    if (!canManageSettings(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền cập nhật cài đặt nhà hàng.",
        };
    }

    const typeValue = formData.get("type");
    const file = formData.get("file");

    if (typeof typeValue !== "string" || !isBrandingType(typeValue)) {
        return {
            success: false,
            message: "Loại hình ảnh không hợp lệ.",
        };
    }

    if (!(file instanceof File) || file.size === 0) {
        return {
            success: false,
            message: "Vui lòng chọn hình ảnh.",
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            success: false,
            message: "Dung lượng hình ảnh không được vượt quá 1 MB.",
        };
    }

    const isIcoExtension = /\.ico$/i.test(file.name);

    const extension =
        ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES] ??
        (typeValue === "favicon" && isIcoExtension ? "ico" : undefined);

    if (!extension) {
        return {
            success: false,
            message:
                typeValue === "favicon"
                    ? "Chỉ chấp nhận ảnh PNG, JPEG, WebP hoặc ICO."
                    : "Logo chỉ hỗ trợ PNG, JPEG hoặc WebP.",
        };
    }

    if (extension === "ico" && typeValue !== "favicon") {
        return {
            success: false,
            message: "File ICO chỉ được sử dụng làm favicon.",
        };
    }

    const contentType = extension === "ico" ? "image/x-icon" : file.type;

    const admin = createAdminClient();
    const restaurantId = userContext.restaurantId;
    const column = typeValue === "logo" ? "logo_url" : "favicon_url";

    const filePath = `${restaurantId}/${typeValue}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await admin.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            contentType,
            upsert: false,
        });

    if (uploadError) {
        console.error("Upload restaurant branding failed:", uploadError);

        return {
            success: false,
            message: "Không thể tải hình ảnh lên. Vui lòng thử lại.",
        };
    }

    const { data: publicData } = admin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    const publicUrl = publicData.publicUrl;

    const { data: restaurant, error: updateError } = await admin
        .from("restaurants")
        .update({ [column]: publicUrl })
        .eq("id", restaurantId)
        .select("id")
        .maybeSingle();

    if (updateError || !restaurant) {
        await admin.storage.from(BUCKET_NAME).remove([filePath]);

        console.error("Update restaurant branding failed:", updateError);

        return {
            success: false,
            message: "Không thể lưu hình ảnh vào cài đặt nhà hàng.",
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message:
            typeValue === "logo"
                ? "Đã cập nhật logo nhà hàng."
                : "Đã cập nhật favicon nhà hàng.",
        url: publicUrl,
    };
}

export async function deleteRestaurantBranding(
    type: BrandingType,
): Promise<{ success: boolean; message: string }> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Không tìm thấy thông tin tài khoản.",
        };
    }

    if (!canManageSettings(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền cập nhật cài đặt nhà hàng.",
        };
    }

    if (type !== "logo" && type !== "favicon") {
        return {
            success: false,
            message: "Loại hình ảnh không hợp lệ.",
        };
    }

    const admin = createAdminClient();
    const restaurantId = userContext.restaurantId;
    const column = type === "logo" ? "logo_url" : "favicon_url";

    // Chỉ lấy URL của nhà hàng thuộc tài khoản đã xác thực.
    const { data: restaurant, error: readError } = await admin
        .from("restaurants")
        .select("logo_url, favicon_url")
        .eq("id", restaurantId)
        .maybeSingle();

    if (readError || !restaurant) {
        console.error("Read restaurant branding failed:", readError);

        return {
            success: false,
            message: "Không thể lấy thông tin hình ảnh nhà hàng.",
        };
    }

    const imageUrl =
        type === "logo" ? restaurant.logo_url : restaurant.favicon_url;

    if (!imageUrl) {
        return {
            success: true,
            message: "Hình ảnh đã được xóa trước đó.",
        };
    }

    // Chỉ chấp nhận URL thuộc đúng bucket của dự án.
    const { data: storageData } = admin.storage
        .from(BUCKET_NAME)
        .getPublicUrl("");

    const baseUrl = storageData.publicUrl.replace(/\/$/, "");

    if (typeof imageUrl !== "string" || !imageUrl.startsWith(`${baseUrl}/`)) {
        return {
            success: false,
            message: "Đường dẫn hình ảnh không hợp lệ.",
        };
    }

    const filePath = imageUrl.slice(baseUrl.length + 1);

    // Chỉ cho phép xóa file nằm trong thư mục của nhà hàng hiện tại.
    if (!filePath.startsWith(`${restaurantId}/`) || filePath.includes("..")) {
        return {
            success: false,
            message: "Không thể xóa hình ảnh ngoài phạm vi nhà hàng.",
        };
    }

    // Xóa tham chiếu trong database trước.
    const { data: updatedRestaurant, error: updateError } = await admin
        .from("restaurants")
        .update({ [column]: null })
        .eq("id", restaurantId)
        .eq(column, imageUrl)
        .select("id")
        .maybeSingle();

    if (updateError || !updatedRestaurant) {
        console.error("Clear restaurant branding failed:", updateError);

        return {
            success: false,
            message: "Không thể cập nhật cài đặt hình ảnh.",
        };
    }

    // Database đã cập nhật thành công; tiếp tục dọn file Storage.
    const { error: deleteError } = await admin.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

    if (deleteError) {
        console.error("Delete restaurant branding file failed:", {
            restaurantId,
            filePath,
            error: deleteError,
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");

        return {
            success: true,
            message:
                "Đã gỡ hình ảnh khỏi cài đặt, nhưng chưa xóa được file lưu trữ.",
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message:
            type === "logo"
                ? "Đã xóa logo nhà hàng."
                : "Đã xóa favicon nhà hàng.",
    };
}
