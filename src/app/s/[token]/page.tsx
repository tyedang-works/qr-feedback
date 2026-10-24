import { notFound } from "next/navigation";

import SurveyForm from "@/components/survey/SurveyForm";
import { createAdminClient } from "@/lib/supabase/admin";

type SurveyPageProps = {
    params: Promise<{
        token: string;
    }>;
};

export default async function SurveyPage({ params }: SurveyPageProps) {
    const { token } = await params;
    const supabase = createAdminClient();

    const { data: table, error: tableError } = await supabase
        .from("tables")
        .select("restaurant_id")
        .eq("token", token)
        .single();

    if (tableError || !table) {
        notFound();
    }

    const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("name, logo_url")
        .eq("id", table.restaurant_id)
        .single();

    if (restaurantError) {
        console.error("Failed to load restaurant for survey:", restaurantError);
    }

    return (
        <SurveyForm
            tableToken={token}
            restaurantName={restaurant?.name ?? "Nhà hàng"}
            restaurantLogoUrl={restaurant?.logo_url ?? null}
        />
    );
}
