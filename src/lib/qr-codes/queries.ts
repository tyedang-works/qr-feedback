import { createClient } from "@/lib/supabase/server";
import type { QRCodeFilters, QRCodeListResult, QRCodeTable } from "./types";

export async function getQRCodeTables(
    restaurantId: string,
    filters: QRCodeFilters,
): Promise<QRCodeListResult> {
    const supabase = await createClient();

    const { page, pageSize, keyword, status, sort } = filters;

    // Count matching tables.
    let countQuery = supabase
        .from("tables")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("restaurant_id", restaurantId);

    if (keyword.trim()) {
        countQuery = countQuery.ilike("name", `%${keyword.trim()}%`);
    }

    if (status === "active") {
        countQuery = countQuery.eq("is_active", true);
    }

    if (status === "inactive") {
        countQuery = countQuery.eq("is_active", false);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
        console.error("Failed to count QR code tables:", countError);

        return {
            data: [],
            total: 0,
            page: 1,
            pageSize,
            totalPages: 0,
        };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    const safePage =
        totalPages > 0 ? Math.min(Math.max(page, 1), totalPages) : 1;

    const from = (safePage - 1) * pageSize;
    const to = from + pageSize - 1;

    // Fetch current page.
    let dataQuery = supabase
        .from("tables")
        .select("id, name, token, is_active")
        .eq("restaurant_id", restaurantId);

    if (keyword.trim()) {
        dataQuery = dataQuery.ilike("name", `%${keyword.trim()}%`);
    }

    if (status === "active") {
        dataQuery = dataQuery.eq("is_active", true);
    }

    if (status === "inactive") {
        dataQuery = dataQuery.eq("is_active", false);
    }

    dataQuery = dataQuery
        .order("name", {
            ascending: sort === "name_asc",
        })
        .range(from, to);

    const { data, error } = await dataQuery;

    if (error) {
        console.error("Failed to fetch QR code tables:", error);

        return {
            data: [],
            total,
            page: safePage,
            pageSize,
            totalPages,
        };
    }

    const tables: QRCodeTable[] = (data ?? []).map((table) => ({
        id: table.id,
        name: table.name,
        token: table.token,
        isActive: table.is_active,
    }));

    return {
        data: tables,
        total,
        page: safePage,
        pageSize,
        totalPages,
    };
}

export async function getQRCodeTablesByIds(
    restaurantId: string,
    ids: string[],
): Promise<QRCodeTable[]> {
    if (ids.length === 0) {
        return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tables")
        .select("id, name, token, is_active")
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true)
        .in("id", ids)
        .order("name", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to fetch QR code tables by ids:", error);

        return [];
    }

    return (data ?? []).map((table) => ({
        id: table.id,
        name: table.name,
        token: table.token,
        isActive: table.is_active,
    }));
}
