import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "../supabase/admin";
import type { UserRole } from "./constants";
import { UserRoleMember } from "./user-roles.types";

export type UserContext = {
    userId: string;
    fullName: string | null;
    role: UserRole;
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

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role, restaurant_id")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        console.error("Failed to get user profile:", profileError);

        return null;
    }

    const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("name")
        .eq("id", profile.restaurant_id)
        .single();

    if (restaurantError || !restaurant) {
        console.error("Failed to get restaurant:", restaurantError);

        return null;
    }

    return {
        userId: user.id,
        fullName: profile.full_name,
        role: profile.role as UserRole,
        restaurantId: profile.restaurant_id,
        restaurantName: restaurant.name,
    };
}

export async function getRestaurantMembers(
    restaurantId: string,
): Promise<UserRoleMember[]> {
    const adminSupabase = createAdminClient();

    const { data: profiles, error: profilesError } = await adminSupabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: true });

    if (profilesError) {
        console.error("Failed to get restaurant members:", profilesError);

        return [];
    }

    if (!profiles || profiles.length === 0) {
        return [];
    }

    const members: UserRoleMember[] = [];

    for (const profile of profiles) {
        const {
            data: { user },
            error: userError,
        } = await adminSupabase.auth.admin.getUserById(profile.id);

        if (userError || !user) {
            console.error(`Failed to get auth user ${profile.id}:`, {
                error: userError,
                message: userError?.message,
                status: userError?.status,
            });

            continue;
        }

        members.push({
            id: profile.id,
            fullName: profile.full_name,
            email: user.email ?? "",
            role: profile.role as UserRoleMember["role"],
        });
    }

    console.log("Restaurant members:", members);

    return members;
}
