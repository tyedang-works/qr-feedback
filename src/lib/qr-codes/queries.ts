import { createClient } from "@/lib/supabase/server";
import type { QRCodeFilters, QRCodeListResult, QRCodeTable } from "./types";

export async function getQRCodeTables(
    restaurantId: string,
    filters: QRCodeFilters,
): Promise<QRCodeListResult> {
    const supabase = await createClient();

    const { page, pageSize, keyword, status, sort } = filters;
    const normalizedKeyword = keyword.trim();

    let countQuery = supabase
        .from("tables")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId);

    if (normalizedKeyword) {
        countQuery = countQuery.ilike("name", `%${normalizedKeyword}%`);
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
            selectableTotal: 0,
            page: 1,
            pageSize,
            totalPages: 0,
        };
    }

    const total = count ?? 0;

    /**
     * selectableTotal:
     *
     * Only active tables can be selected for QR printing.
     *
     * status = active
     *   -> all returned tables are selectable
     *
     * status = inactive
     *   -> nothing is selectable
     *
     * status = all
     *   -> count active tables matching keyword
     */
    let selectableTotal = 0;

    if (status === "active") {
        selectableTotal = total;
    } else if (status === "all") {
        let selectableCountQuery = supabase
            .from("tables")
            .select("*", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true);

        if (normalizedKeyword) {
            selectableCountQuery = selectableCountQuery.ilike(
                "name",
                `%${normalizedKeyword}%`,
            );
        }

        const { count: selectableCount, error: selectableCountError } =
            await selectableCountQuery;

        if (selectableCountError) {
            console.error(
                "Failed to count selectable QR code tables:",
                selectableCountError,
            );
        } else {
            selectableTotal = selectableCount ?? 0;
        }
    }

    const totalPages = Math.ceil(total / pageSize);

    const safePage =
        totalPages > 0 ? Math.min(Math.max(page, 1), totalPages) : 1;

    const from = (safePage - 1) * pageSize;
    const to = from + pageSize - 1;

    let dataQuery = supabase
        .from("tables")
        .select("id, name, token, is_active")
        .eq("restaurant_id", restaurantId);

    if (normalizedKeyword) {
        dataQuery = dataQuery.ilike("name", `%${normalizedKeyword}%`);
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
            selectableTotal,
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
        selectableTotal,
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

export async function getQRCodeTablesForBulkPrint(
    restaurantId: string,
    filters: QRCodeFilters,
    excludedIds: string[],
): Promise<QRCodeTable[]> {
    if (filters.status === "inactive") {
        return [];
    }

    const supabase = await createClient();

    const normalizedKeyword = filters.keyword.trim();

    let query = supabase
        .from("tables")
        .select("id, name, token, is_active")
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true);

    if (normalizedKeyword) {
        query = query.ilike("name", `%${normalizedKeyword}%`);
    }

    query = query.order("name", {
        ascending: filters.sort === "name_asc",
    });

    const { data, error } = await query;

    if (error) {
        console.error("Failed to fetch QR code tables for bulk print:", error);

        return [];
    }

    const excludedIdSet = new Set(excludedIds);

    return (data ?? [])
        .filter((table) => !excludedIdSet.has(table.id))
        .map((table) => ({
            id: table.id,
            name: table.name,
            token: table.token,
            isActive: table.is_active,
        }));
}
