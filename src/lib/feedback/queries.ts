import { createClient } from "@/lib/supabase/server";

import { FEEDBACK_STATUS, type FeedbackStatus } from "./constants";
import type {
    FeedbackDetail,
    FeedbackFilters,
    FeedbackListItem,
    FeedbackListResult,
    FeedbackSummary,
} from "./types";

const EXPORT_BATCH_SIZE = 500;

type FeedbackSearchFilters = Pick<
    FeedbackFilters,
    "keyword" | "issue" | "tableId" | "status"
>;

type FeedbackRow = {
    id: string;
    public_id: string;
    table_id: string;
    selected_options: string[] | null;
    feedback: string | null;
    phone: string;
    status: string;
    internal_note: string | null;
    created_at: string;
};

type FeedbackTable = {
    id: string;
    name: string;
};

/**
 * Normalize Vietnamese text for accent-insensitive search.
 */
function normalizeFeedbackKeyword(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .toLowerCase()
        .trim();
}

function getSearchKeyword(keyword: string): string {
    return normalizeFeedbackKeyword(keyword);
}

/**
 * Map a database row to the feedback list model.
 */
function mapFeedbackRow(
    item: FeedbackRow,
    tableNameMap: Map<string, string>,
): FeedbackListItem {
    return {
        id: item.id,
        publicId: item.public_id,
        tableId: item.table_id,
        tableName: tableNameMap.get(item.table_id) ?? "Không xác định",
        selectedOptions: item.selected_options ?? [],
        feedback: item.feedback ?? "",
        phone: item.phone,
        status: item.status as FeedbackStatus,
        internalNote: item.internal_note,
        createdAt: item.created_at,
    };
}

/**
 * Fetch table names for the feedback records.
 */
async function getTableNameMap(
    tableIds: string[],
    restaurantId?: string,
): Promise<Map<string, string>> {
    if (tableIds.length === 0) {
        return new Map();
    }

    const supabase = await createClient();

    let query = supabase.from("tables").select("id, name").in("id", tableIds);

    if (restaurantId) {
        query = query.eq("restaurant_id", restaurantId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Failed to get feedback table names:", error);
        throw new Error("Không thể tải thông tin bàn.");
    }

    return new Map(
        ((data ?? []) as FeedbackTable[]).map((table) => [
            table.id,
            table.name,
        ]),
    );
}

function getEmptyFeedbackList(pageSize: number): FeedbackListResult {
    return {
        data: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
    };
}

/**
 * Get paginated feedback with filters.
 */
export async function getFeedbackList(
    restaurantId: string,
    filters: FeedbackFilters,
): Promise<FeedbackListResult> {
    const supabase = await createClient();
    const { page, pageSize } = filters;

    const normalizedKeyword = getSearchKeyword(filters.keyword);

    let countQuery = supabase
        .from("feedback")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId);

    if (normalizedKeyword) {
        countQuery = countQuery.ilike(
            "feedback_search",
            `%${normalizedKeyword}%`,
        );
    }

    if (filters.tableId && filters.tableId !== "all") {
        countQuery = countQuery.eq("table_id", filters.tableId);
    }

    if (filters.issue && filters.issue !== "all") {
        countQuery = countQuery.contains("selected_options", [filters.issue]);
    }

    if (filters.status && filters.status !== "all") {
        countQuery = countQuery.eq("status", filters.status);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
        console.error("Failed to get feedback count:", countError);
        throw new Error("Không thể tải tổng số phản hồi.");
    }

    const total = count ?? 0;

    if (total === 0) {
        return getEmptyFeedbackList(pageSize);
    }

    const totalPages = Math.ceil(total / pageSize);
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const from = (safePage - 1) * pageSize;
    const to = from + pageSize - 1;

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

    if (normalizedKeyword) {
        feedbackQuery = feedbackQuery.ilike(
            "feedback_search",
            `%${normalizedKeyword}%`,
        );
    }

    if (filters.tableId && filters.tableId !== "all") {
        feedbackQuery = feedbackQuery.eq("table_id", filters.tableId);
    }

    if (filters.issue && filters.issue !== "all") {
        feedbackQuery = feedbackQuery.contains("selected_options", [
            filters.issue,
        ]);
    }

    if (filters.status && filters.status !== "all") {
        feedbackQuery = feedbackQuery.eq("status", filters.status);
    }

    const { data, error } = await feedbackQuery
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Failed to get feedback list:", error);
        throw new Error("Không thể tải danh sách phản hồi.");
    }

    const feedbackRows = (data ?? []) as FeedbackRow[];

    if (feedbackRows.length === 0) {
        return {
            data: [],
            total,
            page: safePage,
            pageSize,
            totalPages,
        };
    }

    const tableIds = [...new Set(feedbackRows.map((item) => item.table_id))];

    const tableNameMap = await getTableNameMap(tableIds, restaurantId);

    return {
        data: feedbackRows.map((item) => mapFeedbackRow(item, tableNameMap)),
        total,
        page: safePage,
        pageSize,
        totalPages,
    };
}

/**
 * Get one feedback record by its public ID.
 */
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
        console.error("Failed to get feedback detail:", feedbackError);
        throw new Error("Không thể tải chi tiết phản hồi.");
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
        console.error("Failed to get feedback table:", tableError);
        throw new Error("Không thể tải thông tin bàn.");
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
        internalNote: feedback.internal_note,
        createdAt: feedback.created_at,
    };
}

/**
 * Export all feedback matching the supplied filters.
 */
export async function getFeedbackExport(
    restaurantId: string,
    filters: FeedbackSearchFilters,
): Promise<FeedbackListItem[]> {
    const supabase = await createClient();
    const result: FeedbackListItem[] = [];

    const normalizedKeyword = getSearchKeyword(filters.keyword);
    let from = 0;

    while (true) {
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

        if (normalizedKeyword) {
            query = query.ilike("feedback_search", `%${normalizedKeyword}%`);
        }

        if (filters.tableId && filters.tableId !== "all") {
            query = query.eq("table_id", filters.tableId);
        }

        if (filters.issue && filters.issue !== "all") {
            query = query.contains("selected_options", [filters.issue]);
        }

        if (filters.status && filters.status !== "all") {
            query = query.eq("status", filters.status);
        }

        const { data, error } = await query
            .order("created_at", { ascending: false })
            .range(from, from + EXPORT_BATCH_SIZE - 1);

        if (error) {
            console.error("Failed to export feedback:", error);
            throw new Error("Không thể tải dữ liệu phản hồi để xuất báo cáo.");
        }

        const feedbackRows = (data ?? []) as FeedbackRow[];

        if (feedbackRows.length === 0) {
            break;
        }

        const tableIds = [
            ...new Set(feedbackRows.map((item) => item.table_id)),
        ];

        const tableNameMap = await getTableNameMap(tableIds, restaurantId);

        result.push(
            ...feedbackRows.map((item) => mapFeedbackRow(item, tableNameMap)),
        );

        if (feedbackRows.length < EXPORT_BATCH_SIZE) {
            break;
        }

        from += EXPORT_BATCH_SIZE;
    }

    return result;
}

/**
 * Get restaurant-wide feedback statistics.
 */
export async function getFeedbackSummary(
    restaurantId: string,
): Promise<FeedbackSummary> {
    const supabase = await createClient();

    const countByStatus = async (status?: FeedbackStatus): Promise<number> => {
        let query = supabase
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId);

        if (status) {
            query = query.eq("status", status);
        }

        const { count, error } = await query;

        if (error) {
            console.error("Failed to get feedback summary:", error);
            throw new Error("Không thể tải thống kê phản hồi.");
        }

        return count ?? 0;
    };

    const [total, newCount, inProgress, resolved] = await Promise.all([
        countByStatus(),
        countByStatus(FEEDBACK_STATUS.NEW),
        countByStatus(FEEDBACK_STATUS.IN_PROGRESS),
        countByStatus(FEEDBACK_STATUS.RESOLVED),
    ]);

    return {
        total,
        new: newCount,
        inProgress,
        resolved,
    };
}
