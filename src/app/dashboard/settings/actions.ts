"use server";

import { revalidatePath } from "next/cache";

import { getUserContext } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";
import type { UpdateRestaurantSettingsInput } from "@/lib/restaurant/types";

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
    input: UpdateRestaurantSettingsInput,
): Promise<UpdateRestaurantSettingsResult> {
    const name = input.name.trim();
    const phone = input.phone.trim();
    const email = input.email.trim();
    const address = input.address.trim();

    if (!name) {
        return {
            success: false,
            message: "Vui lòng nhập tên nhà hàng.",
        };
    }

    if (name.length > 100) {
        return {
            success: false,
            message: "Tên nhà hàng không được vượt quá 100 ký tự.",
        };
    }

    if (phone.length > 30) {
        return {
            success: false,
            message: "Số điện thoại không được vượt quá 30 ký tự.",
        };
    }

    if (email.length > 254) {
        return {
            success: false,
            message: "Email không được vượt quá 254 ký tự.",
        };
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            success: false,
            message: "Email không hợp lệ.",
        };
    }

    if (address.length > 500) {
        return {
            success: false,
            message: "Địa chỉ không được vượt quá 500 ký tự.",
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
            message: "Không thể cập nhật thông tin nhà hàng.",
        };
    }

    if (!data || data.length === 0) {
        console.error(
            "Restaurant update affected no rows:",
            userContext.restaurantId,
        );

        return {
            success: false,
            message:
                "Không thể cập nhật nhà hàng. Vui lòng kiểm tra quyền truy cập.",
        };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
        success: true,
        message: "Đã cập nhật thông tin nhà hàng.",
    };
}
