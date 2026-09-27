import { createClient } from "@/lib/supabase/server";

export type UserContext = {
    userId: string;
    fullName: string | null;
    restaurantId: string;
    restaurantName: string;
};

export async function getUserContext(): Promise<UserContext | null> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("full_name, restaurant_id")
            .eq("id", user.id)
            .single();

    if (profileError || !profile) {
        console.error(
            "Failed to get user profile:",
            profileError,
        );

        return null;
    }

    const { data: restaurant, error: restaurantError } =
        await supabase
            .from("restaurants")
            .select("name")
            .eq("id", profile.restaurant_id)
            .single();

    if (restaurantError || !restaurant) {
        console.error(
            "Failed to get restaurant:",
            restaurantError,
        );

        return null;
    }

    return {
        userId: user.id,
        fullName: profile.full_name,
        restaurantId: profile.restaurant_id,
        restaurantName: restaurant.name,
    };
}