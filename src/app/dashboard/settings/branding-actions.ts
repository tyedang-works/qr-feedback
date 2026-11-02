"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { translations, type Locale } from "@/i18n/translations";
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

async function getSettingsMessages() {
    const cookieStore = await cookies();

    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    return translations[locale].settings;
}

export async function uploadRestaurantBranding(
    formData: FormData,
): Promise<BrandingActionResult> {
    const messages = await getSettingsMessages();

    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: messages.loginRequired,
        };
    }

    if (!canManageSettings(userContext.role)) {
        return {
            success: false,
            message: messages.permissionDenied,
        };
    }

    const typeValue = formData.get("type");
    const file = formData.get("file");

    if (typeof typeValue !== "string" || !isBrandingType(typeValue)) {
        return {
            success: false,
            message: messages.invalidImageType,
        };
    }

    if (!(file instanceof File) || file.size === 0) {
        return {
            success: false,
            message: messages.imageRequired,
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            success: false,
            message: messages.imageSizeError,
        };
    }

    const isIcoExtension = /\.ico$/i.test(file.name);

    const extension =
        ALLOWED_TYPES[file.type] ??
        (typeValue === "favicon" && isIcoExtension ? "ico" : undefined);

    if (!extension) {
        return {
            success: false,
            message:
                typeValue === "favicon"
                    ? messages.faviconFormatError
                    : messages.logoFormatError,
        };
    }

    if (extension === "ico" && typeValue !== "favicon") {
        return {
            success: false,
            message: messages.icoOnlyFavicon,
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
            message: messages.uploadImageFailed,
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
            message: messages.saveImageFailed,
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message:
            typeValue === "logo"
                ? messages.logoUpdateSuccess
                : messages.faviconUpdateSuccess,
        url: publicUrl,
    };
}

export async function deleteRestaurantBranding(
    type: BrandingType,
): Promise<{ success: boolean; message: string }> {
    const messages = await getSettingsMessages();

    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: messages.loginRequired,
        };
    }

    if (!canManageSettings(userContext.role)) {
        return {
            success: false,
            message: messages.permissionDenied,
        };
    }

    if (type !== "logo" && type !== "favicon") {
        return {
            success: false,
            message: messages.invalidImageType,
        };
    }

    const admin = createAdminClient();
    const restaurantId = userContext.restaurantId;
    const column = type === "logo" ? "logo_url" : "favicon_url";

    const { data: restaurant, error: readError } = await admin
        .from("restaurants")
        .select("logo_url, favicon_url")
        .eq("id", restaurantId)
        .maybeSingle();

    if (readError || !restaurant) {
        console.error("Read restaurant branding failed:", readError);

        return {
            success: false,
            message: messages.getImageFailed,
        };
    }

    const imageUrl =
        type === "logo" ? restaurant.logo_url : restaurant.favicon_url;

    if (!imageUrl) {
        return {
            success: true,
            message: messages.imageAlreadyDeleted,
        };
    }

    const { data: storageData } = admin.storage
        .from(BUCKET_NAME)
        .getPublicUrl("");

    const baseUrl = storageData.publicUrl.replace(/\/$/, "");

    if (typeof imageUrl !== "string" || !imageUrl.startsWith(`${baseUrl}/`)) {
        return {
            success: false,
            message: messages.invalidImageUrl,
        };
    }

    const filePath = imageUrl.slice(baseUrl.length + 1);

    if (!filePath.startsWith(`${restaurantId}/`) || filePath.includes("..")) {
        return {
            success: false,
            message: messages.imageOutsideRestaurant,
        };
    }

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
            message: messages.updateImageSettingsFailed,
        };
    }

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
            message: messages.deleteStorageFailed,
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message:
            type === "logo"
                ? messages.logoDeleteSuccess
                : messages.faviconDeleteSuccess,
    };
}
