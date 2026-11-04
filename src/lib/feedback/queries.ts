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
const VIETNAM_TIMEZONE_OFFSET = "+07:00";
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

type FeedbackSearchFilters = Pick<
    FeedbackFilters,
    | "keyword"
    | "issues"
    | "tableIds"
    | "status"
    | "startDate"
    | "endDate"
    | "sort"
>;

type NormalizedFeedbackFilters = {
    keyword: string;
    issues: string[];
    tableIds: string[];
    status: string | null;
    startDate: string | null;
    endDateExclusive: string | null;
    sort: "newest" | "oldest";
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
    resolved_by: string | null;
    resolved_at: string | null;
    created_at: string;
};

type FeedbackTable = {
    id: string;
    name: string;
};

type FeedbackProfile = {
    id: string;
    full_name: string | null;
};

function normalizeFeedbackKeyword(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .toLowerCase()
        .trim();
}

function parseVietnameseDateStart(value?: string): Date | null {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00${VIETNAM_TIMEZONE_OFFSET}`);

    if (
        Number.isNaN(date.getTime()) ||
        date.toLocaleDateString("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh",
        }) !== value
    ) {
        return null;
    }

    return date;
}

function normalizeFeedbackFilters(
    filters: FeedbackSearchFilters,
): NormalizedFeedbackFilters {
    const startDateValue = parseVietnameseDateStart(filters.startDate);
    const endDateValue = parseVietnameseDateStart(filters.endDate);

    const endDateExclusive = endDateValue
        ? new Date(endDateValue.getTime() + MILLISECONDS_PER_DAY).toISOString()
        : null;

    return {
        keyword: normalizeFeedbackKeyword(filters.keyword ?? ""),
        issues: [
            ...new Set(
                (filters.issues ?? []).filter(
                    (issue) => issue !== "" && issue !== "all",
                ),
            ),
        ],
        tableIds: [
            ...new Set(
                (filters.tableIds ?? []).filter(
                    (id) => id !== "" && id !== "all",
                ),
            ),
        ],
        status:
            filters.status && filters.status !== "all" ? filters.status : null,
        startDate: startDateValue?.toISOString() ?? null,
        endDateExclusive,
        sort: filters.sort === "oldest" ? "oldest" : "newest",
    };
}

function mapFeedbackRow(
    item: FeedbackRow,
    tableNameMap: Map<string, string>,
    resolvedByNameMap: Map<string, string | null>,
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
        resolvedByName: item.resolved_by
            ? (resolvedByNameMap.get(item.resolved_by) ?? null)
            : null,
        resolvedAt: item.resolved_at,
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

async function getResolvedByNameMap(
    profileIds: string[],
    restaurantId: string,
): Promise<Map<string, string | null>> {
    if (profileIds.length === 0) {
        return new Map();
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", profileIds)
        .eq("restaurant_id", restaurantId);

    if (error) {
        console.error("Failed to get feedback resolver profiles:", error);
        throw new Error("Không thể tải thông tin người xử lý phản hồi.");
    }

    return new Map(
        ((data ?? []) as FeedbackProfile[]).map((profile) => [
            profile.id,
            profile.full_name,
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

    if (normalizedFilters.tableIds.length > 0) {
        countQuery = countQuery.in("table_id", normalizedFilters.tableIds);
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

    if (normalizedFilters.startDate) {
        countQuery = countQuery.gte("created_at", normalizedFilters.startDate);
    }

    if (normalizedFilters.endDateExclusive) {
        countQuery = countQuery.lt(
            "created_at",
            normalizedFilters.endDateExclusive,
        );
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
            resolved_by,
            resolved_at,
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

    if (normalizedFilters.tableIds.length > 0) {
        feedbackQuery = feedbackQuery.in(
            "table_id",
            normalizedFilters.tableIds,
        );
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

    if (normalizedFilters.startDate) {
        feedbackQuery = feedbackQuery.gte(
            "created_at",
            normalizedFilters.startDate,
        );
    }

    if (normalizedFilters.endDateExclusive) {
        feedbackQuery = feedbackQuery.lt(
            "created_at",
            normalizedFilters.endDateExclusive,
        );
    }

    const { data, error } = await feedbackQuery
        .order("created_at", {
            ascending: normalizedFilters.sort === "oldest",
        })
        .order("id", { ascending: true })
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

    const resolvedByIds = [
        ...new Set(
            feedbackRows
                .map((item) => item.resolved_by)
                .filter((id): id is string => Boolean(id)),
        ),
    ];

    const [tableNameMap, resolvedByNameMap] = await Promise.all([
        getTableNameMap(tableIds, restaurantId),
        getResolvedByNameMap(resolvedByIds, restaurantId),
    ]);

    return {
        data: feedbackRows.map((item) =>
            mapFeedbackRow(item, tableNameMap, resolvedByNameMap),
        ),
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
            resolved_by,
            resolved_at,
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

    const resolvedByNameMap = await getResolvedByNameMap(
        feedback.resolved_by ? [feedback.resolved_by] : [],
        restaurantId,
    );

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
        resolvedByName: feedback.resolved_by
            ? (resolvedByNameMap.get(feedback.resolved_by) ?? null)
            : null,
        resolvedAt: feedback.resolved_at,
        createdAt: feedback.created_at,
    };
}

export async function getFeedbackExport(
    restaurantId: string,
    filters: FeedbackSearchFilters,
): Promise<FeedbackListItem[]> {
    const supabase = await createClient();
    const normalizedFilters = normalizeFeedbackFilters(filters);

    const feedbackRows: FeedbackRow[] = [];

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
                resolved_by,
                resolved_at,
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

        if (normalizedFilters.tableIds.length > 0) {
            query = query.in("table_id", normalizedFilters.tableIds);
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

        if (normalizedFilters.startDate) {
            query = query.gte("created_at", normalizedFilters.startDate);
        }

        if (normalizedFilters.endDateExclusive) {
            query = query.lt("created_at", normalizedFilters.endDateExclusive);
        }

        const { data, error } = await query
            .order("created_at", {
                ascending: normalizedFilters.sort === "oldest",
            })
            .order("id", { ascending: true })
            .range(from, from + EXPORT_BATCH_SIZE - 1);

        if (error) {
            console.error("Failed to export feedback:", error);
            throw new Error("Không thể tải dữ liệu phản hồi để xuất báo cáo.");
        }

        const batch = (data ?? []) as FeedbackRow[];

        if (batch.length === 0) {
            break;
        }

        feedbackRows.push(...batch);

        if (batch.length < EXPORT_BATCH_SIZE) {
            break;
        }

        from += EXPORT_BATCH_SIZE;
    }

    if (feedbackRows.length === 0) {
        return [];
    }

    const tableIds = [...new Set(feedbackRows.map((item) => item.table_id))];

    const resolvedByIds = [
        ...new Set(
            feedbackRows
                .map((item) => item.resolved_by)
                .filter((id): id is string => Boolean(id)),
        ),
    ];

    const [tableNameMap, resolvedByNameMap] = await Promise.all([
        getTableNameMap(tableIds, restaurantId),
        getResolvedByNameMap(resolvedByIds, restaurantId),
    ]);

    return feedbackRows.map((item) =>
        mapFeedbackRow(item, tableNameMap, resolvedByNameMap),
    );
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
