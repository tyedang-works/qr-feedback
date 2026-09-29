import { createClient } from "@/lib/supabase/server";

import type {
    CreateTableInput,
    RestaurantTable,
    RestaurantTableMutationResult,
    UpdateTableInput,
} from "./types";

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
        console.error("Failed to get restaurant tables:", error);

        return [];
    }

    return data;
}

export async function getRestaurantTableList(
    restaurantId: string,
): Promise<RestaurantTable[]> {
    const supabase = await createClient();

    const [tablesResult, feedbackResult] = await Promise.all([
        supabase
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
            }),

        supabase
            .from("feedback")
            .select("table_id")
            .eq("restaurant_id", restaurantId),
    ]);

    if (tablesResult.error) {
        console.error(
            "Failed to get restaurant table list:",
            tablesResult.error,
        );

        return [];
    }

    if (feedbackResult.error) {
        console.error(
            "Failed to get restaurant table feedback:",
            feedbackResult.error,
        );

        return [];
    }

    const feedbackTableIds = new Set(
        feedbackResult.data.map((feedback) => feedback.table_id),
    );

    return tablesResult.data.map((table) => ({
        id: table.id,
        name: table.name,
        token: table.token,
        isActive: table.is_active,
        hasFeedback: feedbackTableIds.has(table.id),
    }));
}

export async function createRestaurantTable(
    restaurantId: string,
    input: CreateTableInput,
): Promise<RestaurantTableMutationResult | null> {
    const supabase = await createClient();

    const name = input.name.trim();

    if (!name) {
        return null;
    }

    const token = `table-${crypto.randomUUID()}`;

    const { data, error } = await supabase
        .from("tables")
        .insert({
            restaurant_id: restaurantId,
            name,
            token,
            is_active: true,
        })
        .select(
            `
                id,
                name,
                token,
                is_active
            `,
        )
        .single();

    if (error) {
        console.error("Failed to create restaurant table:", error);

        throw error;
    }

    return {
        id: data.id,
        name: data.name,
        token: data.token,
        isActive: data.is_active,
    };
}

export async function updateRestaurantTable(
    restaurantId: string,
    tableId: string,
    input: UpdateTableInput,
): Promise<RestaurantTableMutationResult | null> {
    const supabase = await createClient();

    const updateData: {
        name?: string;
        is_active?: boolean;
    } = {};

    if (input.name !== undefined) {
        const name = input.name.trim();

        if (!name) {
            return null;
        }

        updateData.name = name;
    }

    if (input.isActive !== undefined) {
        updateData.is_active = input.isActive;
    }

    if (Object.keys(updateData).length === 0) {
        return null;
    }

    const { data, error } = await supabase
        .from("tables")
        .update(updateData)
        .eq("id", tableId)
        .eq("restaurant_id", restaurantId)
        .select(
            `
            id,
            name,
            token,
            is_active
        `,
        )
        .maybeSingle();

    if (error) {
        console.error("Failed to update restaurant table:", error);

        throw error;
    }

    if (!data) {
        console.error("No table was updated:", {
            tableId,
            restaurantId,
            updateData,
        });

        return null;
    }

    return {
        id: data.id,
        name: data.name,
        token: data.token,
        isActive: data.is_active,
    };
}

export type RestaurantTableSummary = {
    total: number;
    active: number;
    inactive: number;
};

export async function getRestaurantTableSummary(
    restaurantId: string,
): Promise<RestaurantTableSummary> {
    const supabase = await createClient();

    const [totalResult, activeResult] = await Promise.all([
        supabase
            .from("tables")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("restaurant_id", restaurantId),

        supabase
            .from("tables")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true),
    ]);

    if (totalResult.error) {
        console.error(
            "Failed to get total restaurant tables:",
            totalResult.error,
        );
    }

    if (activeResult.error) {
        console.error(
            "Failed to get active restaurant tables:",
            activeResult.error,
        );
    }

    const total = totalResult.count ?? 0;
    const active = activeResult.count ?? 0;

    return {
        total,
        active,
        inactive: Math.max(total - active, 0),
    };
}

export async function hasRestaurantTableFeedback(
    restaurantId: string,
    tableId: string,
): Promise<boolean> {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from("feedback")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("restaurant_id", restaurantId)
        .eq("table_id", tableId);

    if (error) {
        console.error("Failed to check restaurant table feedback:", error);

        throw error;
    }

    return (count ?? 0) > 0;
}

export async function deleteRestaurantTable(
    restaurantId: string,
    tableId: string,
): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tables")
        .delete()
        .eq("id", tableId)
        .eq("restaurant_id", restaurantId)
        .select("id")
        .maybeSingle();

    if (error) {
        console.error("Failed to delete restaurant table:", error);

        throw error;
    }

    return Boolean(data);
}
