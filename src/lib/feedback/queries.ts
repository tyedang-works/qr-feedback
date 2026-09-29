import { createClient } from "@/lib/supabase/server";
import type {
    FeedbackDetail,
    FeedbackFilters,
    FeedbackListResult,
} from "./types";

export async function getFeedbackList(
    restaurantId: string,
    filters: FeedbackFilters,
): Promise<FeedbackListResult> {
    const supabase = await createClient();

    const { page, pageSize, keyword, issue, tableId } = filters;

    /*
     * Build the filtered query first.
     * We use this query to get the total count.
     */
    let countQuery = supabase
        .from("feedback")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("restaurant_id", restaurantId);

    if (keyword.trim()) {
        countQuery = countQuery.ilike("feedback", `%${keyword.trim()}%`);
    }

    if (tableId && tableId !== "all") {
        countQuery = countQuery.eq("table_id", tableId);
    }

    if (issue && issue !== "all") {
        countQuery = countQuery.contains("selected_options", [issue]);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
        console.error(
            "Failed to get feedback count:",
            JSON.stringify(countError, null, 2),
        );

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

    if (total === 0) {
        return {
            data: [],
            total: 0,
            page: 1,
            pageSize,
            totalPages: 0,
        };
    }

    /*
     * Make sure the requested page is valid.
     *
     * Example:
     * total = 5
     * pageSize = 10
     * totalPages = 1
     *
     * /dashboard/feedback?page=2
     * -> safePage = 1
     */
    const safePage = Math.min(Math.max(page, 1), totalPages);

    const from = (safePage - 1) * pageSize;

    const to = Math.min(from + pageSize - 1, total - 1);

    /*
     * Get feedback data for the current page.
     */
    let feedbackQuery = supabase
        .from("feedback")
        .select(
            `
        id,
        public_id,
        table_id,
        selected_options,
        feedback,
        phone,
        created_at
    `,
        )
        .eq("restaurant_id", restaurantId);

    if (keyword.trim()) {
        feedbackQuery = feedbackQuery.ilike("feedback", `%${keyword.trim()}%`);
    }

    if (tableId && tableId !== "all") {
        feedbackQuery = feedbackQuery.eq("table_id", tableId);
    }

    if (issue && issue !== "all") {
        feedbackQuery = feedbackQuery.contains("selected_options", [issue]);
    }

    const { data: feedbackData, error: feedbackError } = await feedbackQuery
        .order("created_at", {
            ascending: false,
        })
        .range(from, to);

    if (feedbackError) {
        console.error(
            "Failed to get feedback list:",
            JSON.stringify(feedbackError, null, 2),
        );

        return {
            data: [],
            total,
            page: safePage,
            pageSize,
            totalPages,
        };
    }

    if (!feedbackData?.length) {
        return {
            data: [],
            total,
            page: safePage,
            pageSize,
            totalPages,
        };
    }

    /*
     * Get table names separately because the
     * Supabase relationship response is typed as an array.
     */
    const tableIds = [...new Set(feedbackData.map((item) => item.table_id))];

    const { data: tablesData, error: tablesError } = await supabase
        .from("tables")
        .select("id, name")
        .in("id", tableIds);

    if (tablesError) {
        console.error("Failed to get feedback tables:", tablesError);
    }

    const tableNameMap = new Map(
        (tablesData ?? []).map((table) => [table.id, table.name]),
    );

    const data = feedbackData.map((item) => ({
        id: item.id,
        publicId: item.public_id,
        tableId: item.table_id,
        tableName: tableNameMap.get(item.table_id) ?? "Không xác định",
        selectedOptions: item.selected_options ?? [],
        feedback: item.feedback ?? "",
        phone: item.phone,
        createdAt: item.created_at,
    }));

    return {
        data,
        total,
        page: safePage,
        pageSize,
        totalPages,
    };
}

export async function getFeedbackDetail(
    restaurantId: string,
    feedbackPublicId: string,
): Promise<FeedbackDetail | null> {
    const supabase = await createClient();

    const { data: feedback, error: feedbackError } = await supabase
        .from("feedback")
        .select(
            `
                id,
                public_id,
                table_id,
                selected_options,
                feedback,
                phone,
                created_at
            `,
        )
        .eq("public_id", feedbackPublicId)
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

    if (feedbackError) {
        console.error(
            "Failed to get feedback detail:",
            JSON.stringify(feedbackError, null, 2),
        );

        return null;
    }

    if (!feedback) {
        return null;
    }

    const { data: table, error: tableError } = await supabase
        .from("tables")
        .select("id, name")
        .eq("id", feedback.table_id)
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

    if (tableError) {
        console.error(
            "Failed to get feedback table:",
            JSON.stringify(tableError, null, 2),
        );
    }

    return {
        id: feedback.id,
        tableId: feedback.table_id,
        tableName: table?.name ?? "Không xác định",
        selectedOptions: feedback.selected_options ?? [],
        feedback: feedback.feedback ?? "",
        phone: feedback.phone,
        createdAt: feedback.created_at,
    };
}
