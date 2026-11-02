"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { translations, type Locale } from "@/i18n/translations";
import { canManageSettings } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import type { UpdateRestaurantSettingsInput } from "@/lib/restaurant/types";
import { createClient } from "@/lib/supabase/server";

type UpdateRestaurantSettingsResult =
    | {
          success: true;
          message: string;
      }
    | {
          success: false;
          message: string;
      };

async function getSettingsMessages() {
    const cookieStore = await cookies();

    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    return translations[locale].settings;
}

export async function updateRestaurantSettings(
    input: UpdateRestaurantSettingsInput,
): Promise<UpdateRestaurantSettingsResult> {
    const messages = await getSettingsMessages();

    const name = input.name.trim();
    const phone = input.phone.trim();
    const email = input.email.trim();
    const address = input.address.trim();

    if (!name) {
        return {
            success: false,
            message: messages.nameRequired,
        };
    }

    if (name.length > 100) {
        return {
            success: false,
            message: messages.nameMaxLength,
        };
    }

    if (phone.length > 30) {
        return {
            success: false,
            message: messages.phoneMaxLength,
        };
    }

    if (email.length > 254) {
        return {
            success: false,
            message: messages.emailMaxLength,
        };
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            success: false,
            message: messages.invalidEmail,
        };
    }

    if (address.length > 500) {
        return {
            success: false,
            message: messages.addressMaxLength,
        };
    }

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

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("restaurants")
        .update({
            name,
            phone: phone || null,
            email: email || null,
            address: address || null,
        })
        .eq("id", userContext.restaurantId)
        .select("id, name, phone, email, address");

    if (error) {
        console.error("Failed to update restaurant settings:", error);

        return {
            success: false,
            message: messages.updateRestaurantFailed,
        };
    }

    if (!data || data.length === 0) {
        console.error(
            "Restaurant update affected no rows:",
            userContext.restaurantId,
        );

        return {
            success: false,
            message: messages.updateRestaurantNoPermission,
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: messages.updateRestaurantSuccess,
    };
}
