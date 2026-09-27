import { createClient } from "@/lib/supabase/server";
import type {
    FeedbackFilters,
    FeedbackListResult,
} from "./types";

export async function getFeedbackList(
    restaurantId: string,
    filters: FeedbackFilters,
): Promise<FeedbackListResult> {
    const supabase = await createClient();

    const {
        page,
        pageSize,
        keyword,
        issue,
        tableId,
    } = filters;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from("feedback")
        .select(
            `
        id,
        table_id,
        selected_options,
        feedback,
        phone,
        created_at
      `,
            {
                count: "exact",
            },
        )
        .eq("restaurant_id", restaurantId);

    if (keyword.trim()) {
        query = query.ilike(
            "feedback",
            `%${keyword.trim()}%`,
        );
    }

    if (tableId) {
        query = query.eq("table_id", tableId);
    }

    if (issue) {
        query = query.contains(
            "selected_options",
            [issue],
        );
    }

    const {
        data: feedbackData,
        count,
        error,
    } = await query
        .order("created_at", {
            ascending: false,
        })
        .range(from, to);

    if (error) {
        console.error(
            "Failed to get feedback list:",
            error,
        );

        return {
            data: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0,
        };
    }

    if (!feedbackData?.length) {
        return {
            data: [],
            total: count ?? 0,
            page,
            pageSize,
            totalPages: Math.ceil(
                (count ?? 0) / pageSize,
            ),
        };
    }

    const tableIds = [
        ...new Set(
            feedbackData.map(
                (item) => item.table_id,
            ),
        ),
    ];

    const {
        data: tablesData,
        error: tablesError,
    } = await supabase
        .from("tables")
        .select("id, name")
        .in("id", tableIds);

    if (tablesError) {
        console.error(
            "Failed to get feedback tables:",
            tablesError,
        );
    }

    const tableNameMap = new Map(
        (tablesData ?? []).map((table) => [
            table.id,
            table.name,
        ]),
    );

    const data = feedbackData.map((item) => ({
        id: item.id,
        tableId: item.table_id,
        tableName:
            tableNameMap.get(item.table_id) ??
            "Không xác định",
        selectedOptions:
            item.selected_options ?? [],
        feedback: item.feedback ?? "",
        phone: item.phone,
        createdAt: item.created_at,
    }));

    return {
        data,
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil(
            (count ?? 0) / pageSize,
        ),
    };
}