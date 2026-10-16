import { createClient } from "@/lib/supabase/server";
import type { RestaurantSettings } from "./types";

export async function getRestaurantSettings(
    restaurantId: string,
): Promise<RestaurantSettings> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, phone, email, address, logo_url, favicon_url")
        .eq("id", restaurantId)
        .single();

    if (error) {
        console.error("Failed to get restaurant settings:", error);
        throw new Error("Không thể tải thông tin nhà hàng.");
    }

    return data;
}
