import { createClient } from "@/lib/supabase/server";

export type RestaurantTableOption = {
    id: string;
    name: string;
};

export async function getRestaurantTables(
    restaurantId: string,
): Promise<RestaurantTableOption[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tables")
        .select("id, name")
        .eq("restaurant_id", restaurantId)
        .order("name", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Failed to get restaurant tables:",
            error,
        );

        return [];
    }

    return data;
}