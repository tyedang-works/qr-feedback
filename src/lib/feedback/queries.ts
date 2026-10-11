import { createClient } from "@/lib/supabase/server";
import type { FeedbackStatus } from "./constants";
import type {
    FeedbackDetail,
    FeedbackFilters,
    FeedbackListItem,
    FeedbackListResult,
} from "./types";

export async function getFeedbackList(
    restaurantId: string,
    filters: FeedbackFilters,
): Promise<FeedbackListResult> {
    const supabase = await createClient();

    const { page, pageSize, keyword, issue, tableId, status } = filters;

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

    if (status && status !== "all") {
        countQuery = countQuery.eq("status", status);
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

    const safePage = Math.min(Math.max(page, 1), totalPages);

    const from = (safePage - 1) * pageSize;

    const to = Math.min(from + pageSize - 1, total - 1);

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
        status,
        internal_note,
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

    if (status && status !== "all") {
        feedbackQuery = feedbackQuery.eq("status", status);
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
        status: item.status as FeedbackStatus,
        internalNote: item.internal_note ?? null,
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
                status,
                internal_note,
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
        publicId: feedback.public_id,
        tableId: feedback.table_id,
        tableName: table?.name ?? "Không xác định",
        selectedOptions: feedback.selected_options ?? [],
        feedback: feedback.feedback ?? "",
        phone: feedback.phone,
        status: feedback.status as FeedbackStatus,
        internalNote: feedback.internal_note ?? null,
        createdAt: feedback.created_at,
    };
}

export async function getFeedbackExport(
    restaurantId: string,
    filters: Pick<FeedbackFilters, "keyword" | "issue" | "tableId" | "status">,
): Promise<FeedbackListItem[]> {
    const supabase = await createClient();
    const batchSize = 500;
    const result: FeedbackListItem[] = [];

    const { keyword, issue, tableId, status } = filters;

    let from = 0;
    let hasMore = true;

    while (hasMore) {
        let query = supabase
            .from("feedback")
            .select(
                `
                    id,
                    public_id,
                    table_id,
                    selected_options,
                    feedback,
                    phone,
                    status,
                    internal_note,
                    created_at
                `,
            )
            .eq("restaurant_id", restaurantId);

        if (keyword.trim()) {
            query = query.ilike("feedback", `%${keyword.trim()}%`);
        }

        if (tableId && tableId !== "all") {
            query = query.eq("table_id", tableId);
        }

        if (issue && issue !== "all") {
            query = query.contains("selected_options", [issue]);
        }

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        const { data, error } = await query
            .order("created_at", { ascending: false })
            .range(from, from + batchSize - 1);

        if (error) {
            console.error("Failed to export feedback:", error);
            throw new Error("Không thể tải dữ liệu phản hồi để xuất báo cáo.");
        }

        const feedbackData = data ?? [];

        if (feedbackData.length === 0) {
            hasMore = false;
            continue;
        }

        const tableIds = [
            ...new Set(feedbackData.map((item) => item.table_id)),
        ];

        const { data: tablesData, error: tablesError } = await supabase
            .from("tables")
            .select("id, name")
            .eq("restaurant_id", restaurantId)
            .in("id", tableIds);

        if (tablesError) {
            console.error("Failed to get feedback export tables:", tablesError);
            throw new Error("Không thể tải thông tin bàn để xuất báo cáo.");
        }

        const tableNameMap = new Map(
            (tablesData ?? []).map((table) => [table.id, table.name]),
        );

        result.push(
            ...feedbackData.map((item) => ({
                id: item.id,
                publicId: item.public_id,
                tableId: item.table_id,
                tableName: tableNameMap.get(item.table_id) ?? "Không xác định",
                selectedOptions: item.selected_options ?? [],
                feedback: item.feedback ?? "",
                phone: item.phone,
                status: item.status as FeedbackStatus,
                internalNote: item.internal_note ?? null,
                createdAt: item.created_at,
            })),
        );

        hasMore = feedbackData.length === batchSize;
        from += batchSize;
    }

    return result;
}
