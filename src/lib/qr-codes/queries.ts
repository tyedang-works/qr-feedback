import { createClient } from "@/lib/supabase/server";

import type { QRCodeTable } from "./types";

export async function getQRCodeTables(
    restaurantId: string,
): Promise<QRCodeTable[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tables")
        .select(
            `
                id,
                name,
                token,
                is_active
            `,
        )
        .eq("restaurant_id", restaurantId)
        .order("name", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Failed to get QR code tables:",
            error,
        );

        return [];
    }

    return data.map((table) => ({
        id: table.id,
        name: table.name,
        token: table.token,
        isActive: table.is_active,
    }));
}