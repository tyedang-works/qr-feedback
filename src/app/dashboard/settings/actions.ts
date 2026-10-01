"use server";

import { revalidatePath } from "next/cache";

import { getUserContext } from "@/lib/auth/queries";
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

export async function updateRestaurantSettings(
    name: string,
): Promise<UpdateRestaurantSettingsResult> {
    const normalizedName = name.trim();

    if (!normalizedName) {
        return {
            success: false,
            message: "Vui lòng nhập tên nhà hàng.",
        };
    }

    if (normalizedName.length > 100) {
        return {
            success: false,
            message: "Tên nhà hàng không được vượt quá 100 ký tự.",
        };
    }

    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Không tìm thấy thông tin tài khoản.",
        };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("restaurants")
        .update({
            name: normalizedName,
        })
        .eq("id", userContext.restaurantId);

    if (error) {
        console.error("Failed to update restaurant settings:", error);

        return {
            success: false,
            message: "Không thể cập nhật thông tin nhà hàng.",
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: "Đã cập nhật thông tin nhà hàng.",
    };
}
