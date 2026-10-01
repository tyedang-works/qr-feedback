import { createClient } from "@/lib/supabase/server";
import type { RestaurantSettings } from "./types";

export async function getRestaurantSettings(
    restaurantId: string,
): Promise<RestaurantSettings> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("restaurants")
        .select("id, name")
        .eq("id", restaurantId)
        .single();

    if (error) {
        throw new Error("Không thể tải thông tin nhà hàng.");
    }

    return data;
}
