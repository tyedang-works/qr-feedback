import { FEEDBACK_ISSUES } from "@/lib/feedback/constants";
import { createClient } from "@/lib/supabase/server";
import type {
    FeedbackStatusDistributionItem,
    FeedbackTrendItem,
    IssueDistributionItem,
    RecentFeedbackItem,
} from "./types";

export type DashboardSummary = {
    totalFeedback: number;
    todayFeedback: number;
    activeTables: number;
    newFeedback: number;
    inProgressFeedback: number;
    resolvedFeedback: number;
};

function getVietnamDateString() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

export async function getDashboardSummary(
    restaurantId: string,
): Promise<DashboardSummary> {
    const supabase = await createClient();

    const vietnamDate = getVietnamDateString();
    const startOfToday = `${vietnamDate}T00:00:00+07:00`;

    const endOfToday = new Date(
        new Date(startOfToday).getTime() + 24 * 60 * 60 * 1000,
    ).toISOString();

    const [
        totalFeedbackResult,
        todayFeedbackResult,
        activeTablesResult,
        newFeedbackResult,
        inProgressFeedbackResult,
        resolvedFeedbackResult,
    ] = await Promise.all([
        supabase
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId),

        supabase
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId)
            .gte("created_at", startOfToday)
            .lt("created_at", endOfToday),

        supabase
            .from("tables")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true),

        supabase
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId)
            .eq("status", "new"),

        supabase
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId)
            .eq("status", "in_progress"),

        supabase
            .from("feedback")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId)
            .eq("status", "resolved"),
    ]);

    const results = [
        ["total feedback", totalFeedbackResult],
        ["today feedback", todayFeedbackResult],
        ["active tables", activeTablesResult],
        ["new feedback", newFeedbackResult],
        ["in-progress feedback", inProgressFeedbackResult],
        ["resolved feedback", resolvedFeedbackResult],
    ] as const;

    results.forEach(([label, result]) => {
        if (result.error) {
            console.error(`Failed to get ${label}:`, result.error);
        }
    });

    return {
        totalFeedback: totalFeedbackResult.count ?? 0,
        todayFeedback: todayFeedbackResult.count ?? 0,
        activeTables: activeTablesResult.count ?? 0,
        newFeedback: newFeedbackResult.count ?? 0,
        inProgressFeedback: inProgressFeedbackResult.count ?? 0,
        resolvedFeedback: resolvedFeedbackResult.count ?? 0,
    };
}

export type FeedbackTrendPeriod = 7 | 30;

export async function getFeedbackTrend(
    restaurantId: string,
    period: FeedbackTrendPeriod = 7,
): Promise<FeedbackTrendItem[]> {
    const supabase = await createClient();

    const vietnamFormatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const today = vietnamFormatter.format(new Date());
    const [year, month, day] = today.split("-").map(Number);

    // Tạo danh sách ngày theo lịch Việt Nam, không phụ thuộc múi giờ server.
    const dates: string[] = [];

    for (let index = period - 1; index >= 0; index -= 1) {
        const date = new Date(Date.UTC(year, month - 1, day - index));

        dates.push(
            [
                date.getUTCFullYear(),
                String(date.getUTCMonth() + 1).padStart(2, "0"),
                String(date.getUTCDate()).padStart(2, "0"),
            ].join("-"),
        );
    }

    const startOfPeriod = `${dates[0]}T00:00:00+07:00`;

    const endOfPeriod = new Date(
        new Date(`${today}T00:00:00+07:00`).getTime() + 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data, error } = await supabase
        .from("feedback")
        .select("created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", startOfPeriod)
        .lt("created_at", endOfPeriod);

    if (error) {
        console.error("Failed to get feedback trend:", error);

        return dates.map((date) => ({
            date,
            label: formatTrendLabel(date),
            count: 0,
        }));
    }

    const countByDate = new Map<string, number>();

    dates.forEach((date) => {
        countByDate.set(date, 0);
    });

    data.forEach((feedback) => {
        const dateString = vietnamFormatter.format(
            new Date(feedback.created_at),
        );

        if (countByDate.has(dateString)) {
            countByDate.set(dateString, (countByDate.get(dateString) ?? 0) + 1);
        }
    });

    return dates.map((date) => ({
        date,
        label: formatTrendLabel(date),
        count: countByDate.get(date) ?? 0,
    }));
}

function formatTrendLabel(date: string) {
    const [, month, day] = date.split("-");

    return `${day}/${month}`;
}

export async function getIssueDistribution(
    restaurantId: string,
): Promise<IssueDistributionItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("feedback")
        .select("selected_options")
        .eq("restaurant_id", restaurantId);

    if (error) {
        console.error("Failed to get issue distribution:", error);

        return FEEDBACK_ISSUES.map((issue) => ({
            option: issue.option,
            label: issue.label,
            count: 0,
            percentage: 0,
        }));
    }

    const countByOption = new Map<string, number>();

    FEEDBACK_ISSUES.forEach((issue) => {
        countByOption.set(issue.option, 0);
    });

    data.forEach((feedback) => {
        feedback.selected_options.forEach((option: string) => {
            if (countByOption.has(option)) {
                countByOption.set(option, (countByOption.get(option) ?? 0) + 1);
            }
        });
    });

    const totalSelections = Array.from(countByOption.values()).reduce(
        (total, count) => total + count,
        0,
    );

    return FEEDBACK_ISSUES.map((issue) => {
        const count = countByOption.get(issue.option) ?? 0;

        return {
            option: issue.option,
            label: issue.label,
            count,
            percentage:
                totalSelections > 0
                    ? Math.round((count / totalSelections) * 100)
                    : 0,
        };
    });
}

export async function getRecentFeedback(
    restaurantId: string,
): Promise<RecentFeedbackItem[]> {
    const supabase = await createClient();

    const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("id, table_id, selected_options, feedback, status, created_at")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(5);

    if (feedbackError) {
        console.error("Failed to get recent feedback:", feedbackError);
        return [];
    }

    if (feedbackData.length === 0) {
        return [];
    }

    const tableIds = [...new Set(feedbackData.map((item) => item.table_id))];

    const { data: tablesData, error: tablesError } = await supabase
        .from("tables")
        .select("id, name")
        .eq("restaurant_id", restaurantId)
        .in("id", tableIds);

    if (tablesError) {
        console.error("Failed to get feedback tables:", tablesError);
    }

    const tableNameMap = new Map(
        (tablesData ?? []).map((table) => [table.id, table.name]),
    );

    return feedbackData.map((item) => ({
        id: item.id,
        tableName: tableNameMap.get(item.table_id) ?? "Không xác định",
        selectedOptions: item.selected_options ?? [],
        feedback: item.feedback ?? "",
        status: item.status as RecentFeedbackItem["status"],
        createdAt: item.created_at,
    }));
}

export async function getFeedbackStatusDistribution(
    restaurantId: string,
): Promise<FeedbackStatusDistributionItem[]> {
    const supabase = await createClient();

    const statuses = [
        { status: "new", label: "Chưa xử lý" },
        { status: "in_progress", label: "Đang xử lý" },
        { status: "resolved", label: "Đã giải quyết" },
    ] as const;

    const { data, error } = await supabase
        .from("feedback")
        .select("status")
        .eq("restaurant_id", restaurantId);

    if (error) {
        console.error("Failed to get feedback status distribution:", error);

        return statuses.map((item) => ({
            ...item,
            count: 0,
            percentage: 0,
        }));
    }

    const countByStatus = new Map<string, number>();

    statuses.forEach(({ status }) => {
        countByStatus.set(status, 0);
    });

    data.forEach((item) => {
        const count = countByStatus.get(item.status);

        if (count !== undefined) {
            countByStatus.set(item.status, count + 1);
        }
    });

    const total = statuses.reduce(
        (sum, item) => sum + (countByStatus.get(item.status) ?? 0),
        0,
    );

    return statuses.map((item) => {
        const count = countByStatus.get(item.status) ?? 0;

        return {
            ...item,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        };
    });
}
