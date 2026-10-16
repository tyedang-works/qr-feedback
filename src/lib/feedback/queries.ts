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
    "keyword" | "issues" | "tableId" | "status"
>;

type NormalizedFeedbackFilters = {
    keyword: string;
    issues: string[];
    tableId: string | null;
    status: string | null;
};

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

function normalizeFeedbackKeyword(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .toLowerCase()
        .trim();
}

function normalizeFeedbackFilters(
    filters: FeedbackSearchFilters,
): NormalizedFeedbackFilters {
    return {
        keyword: normalizeFeedbackKeyword(filters.keyword ?? ""),
        issues: [
            ...new Set(
                (filters.issues ?? []).filter(
                    (issue: string) => issue !== "" && issue !== "all",
                ),
            ),
        ],
        tableId:
            filters.tableId && filters.tableId !== "all"
                ? filters.tableId
                : null,
        status:
            filters.status && filters.status !== "all" ? filters.status : null,
    };
}

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

export async function getFeedbackList(
    restaurantId: string,
    filters: FeedbackFilters,
): Promise<FeedbackListResult> {
    const supabase = await createClient();
    const { page, pageSize } = filters;
    const normalizedFilters = normalizeFeedbackFilters(filters);

    let countQuery = supabase
        .from("feedback")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId);

    if (normalizedFilters.keyword) {
        countQuery = countQuery.ilike(
            "feedback_search",
            `%${normalizedFilters.keyword}%`,
        );
    }

    if (normalizedFilters.tableId) {
        countQuery = countQuery.eq("table_id", normalizedFilters.tableId);
    }

    if (normalizedFilters.issues.length > 0) {
        countQuery = countQuery.overlaps(
            "selected_options",
            normalizedFilters.issues,
        );
    }

    if (normalizedFilters.status) {
        countQuery = countQuery.eq("status", normalizedFilters.status);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
        console.error("Failed to get feedback count:", countError);
        throw new Error("Không thể tải tổng số phản hồi.");
    }

    const total = count ?? 0;

    if (total === 0) {
        return {
            data: [],
            total: 0,
            page: 1,
            pageSize,
            totalPages: 0,
        };
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

    if (normalizedFilters.keyword) {
        feedbackQuery = feedbackQuery.ilike(
            "feedback_search",
            `%${normalizedFilters.keyword}%`,
        );
    }

    if (normalizedFilters.tableId) {
        feedbackQuery = feedbackQuery.eq("table_id", normalizedFilters.tableId);
    }

    if (normalizedFilters.issues.length > 0) {
        feedbackQuery = feedbackQuery.overlaps(
            "selected_options",
            normalizedFilters.issues,
        );
    }

    if (normalizedFilters.status) {
        feedbackQuery = feedbackQuery.eq("status", normalizedFilters.status);
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

export async function getFeedbackExport(
    restaurantId: string,
    filters: FeedbackSearchFilters,
): Promise<FeedbackListItem[]> {
    const supabase = await createClient();
    const result: FeedbackListItem[] = [];
    const normalizedFilters = normalizeFeedbackFilters(filters);

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

        if (normalizedFilters.keyword) {
            query = query.ilike(
                "feedback_search",
                `%${normalizedFilters.keyword}%`,
            );
        }

        if (normalizedFilters.tableId) {
            query = query.eq("table_id", normalizedFilters.tableId);
        }

        if (normalizedFilters.issues.length > 0) {
            query = query.overlaps(
                "selected_options",
                normalizedFilters.issues,
            );
        }

        if (normalizedFilters.status) {
            query = query.eq("status", normalizedFilters.status);
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
