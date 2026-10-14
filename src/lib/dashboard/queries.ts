import { FEEDBACK_ISSUES } from "@/lib/feedback/constants";
import { createClient } from "@/lib/supabase/server";
import type {
    FeedbackStatusDistributionItem,
    FeedbackTrendItem,
    IssueComparisonPeriod,
    IssueComparisonResult,
    IssueDistributionItem,
    IssueWeeklyComparisonItem,
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

export type SummaryComparison = {
    last7DaysFeedback: number;
    previous7DaysFeedback: number;
    yesterdayFeedback: number;
};

function shiftVietnamDate(dateString: string, days: number) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + days));

    return [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");
}

export async function getSummaryComparison(
    restaurantId: string,
): Promise<SummaryComparison> {
    const supabase = await createClient();

    const today = getVietnamDateString();
    const yesterday = shiftVietnamDate(today, -1);
    const last7DaysStart = shiftVietnamDate(today, -6);
    const previous7DaysStart = shiftVietnamDate(today, -13);

    const startOfToday = `${today}T00:00:00+07:00`;
    const startOfYesterday = `${yesterday}T00:00:00+07:00`;
    const startOfLast7Days = `${last7DaysStart}T00:00:00+07:00`;
    const startOfPrevious7Days = `${previous7DaysStart}T00:00:00+07:00`;

    const [last7DaysResult, previous7DaysResult, yesterdayResult] =
        await Promise.all([
            supabase
                .from("feedback")
                .select("id", { count: "exact", head: true })
                .eq("restaurant_id", restaurantId)
                .gte("created_at", startOfLast7Days)
                .lt("created_at", new Date(startOfToday).toISOString()),

            supabase
                .from("feedback")
                .select("id", { count: "exact", head: true })
                .eq("restaurant_id", restaurantId)
                .gte("created_at", startOfPrevious7Days)
                .lt("created_at", startOfLast7Days),

            supabase
                .from("feedback")
                .select("id", { count: "exact", head: true })
                .eq("restaurant_id", restaurantId)
                .gte("created_at", startOfYesterday)
                .lt("created_at", startOfToday),
        ]);

    if (
        last7DaysResult.error ||
        previous7DaysResult.error ||
        yesterdayResult.error
    ) {
        console.error("Failed to get summary comparison:", {
            last7DaysError: last7DaysResult.error,
            previous7DaysError: previous7DaysResult.error,
            yesterdayError: yesterdayResult.error,
        });

        throw new Error("Không thể tải dữ liệu so sánh Dashboard.");
    }

    return {
        last7DaysFeedback: last7DaysResult.count ?? 0,
        previous7DaysFeedback: previous7DaysResult.count ?? 0,
        yesterdayFeedback: yesterdayResult.count ?? 0,
    };
}

export async function getWeeklyIssueComparison(
    restaurantId: string,
): Promise<IssueWeeklyComparisonItem[]> {
    const supabase = await createClient();

    const today = getVietnamDateString();
    const currentPeriodStart = shiftVietnamDate(today, -6);
    const previousPeriodStart = shiftVietnamDate(today, -13);
    const tomorrow = shiftVietnamDate(today, 1);

    const currentStart = `${currentPeriodStart}T00:00:00+07:00`;
    const previousStart = `${previousPeriodStart}T00:00:00+07:00`;
    const endOfPeriod = `${tomorrow}T00:00:00+07:00`;

    const { data, error } = await supabase
        .from("feedback")
        .select("selected_options, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", previousStart)
        .lt("created_at", endOfPeriod);

    if (error) {
        console.error("Failed to get weekly issue comparison:", error);
        throw new Error("Không thể tải dữ liệu so sánh vấn đề theo tuần.");
    }

    const currentCounts = new Map<string, number>();
    const previousCounts = new Map<string, number>();

    FEEDBACK_ISSUES.forEach(({ option }) => {
        currentCounts.set(option, 0);
        previousCounts.set(option, 0);
    });

    const currentStartTime = new Date(currentStart).getTime();

    data.forEach((feedback) => {
        const createdAt = new Date(feedback.created_at).getTime();

        const targetCounts =
            createdAt >= currentStartTime ? currentCounts : previousCounts;

        (feedback.selected_options ?? []).forEach((option: string) => {
            if (targetCounts.has(option)) {
                targetCounts.set(option, (targetCounts.get(option) ?? 0) + 1);
            }
        });
    });

    return FEEDBACK_ISSUES.map((issue) => ({
        option: issue.option,
        label: issue.label,
        currentCount: currentCounts.get(issue.option) ?? 0,
        previousCount: previousCounts.get(issue.option) ?? 0,
    })).sort((a, b) => b.currentCount - a.currentCount);
}

function formatDateKey(date: Date) {
    return [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");
}

function getVietnamTodayUTC() {
    const [year, month, day] = getVietnamDateString().split("-").map(Number);

    return new Date(Date.UTC(year, month - 1, day));
}

function getDateOffset(date: Date, offset: number) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + offset);
    return result;
}

function getMonthStart(year: number, month: number) {
    return new Date(Date.UTC(year, month - 1, 1));
}

function toVietnamDateTime(date: Date) {
    return `${formatDateKey(date)}T00:00:00+07:00`;
}

export async function getIssueComparison(
    restaurantId: string,
    period: IssueComparisonPeriod = "week",
    year?: number,
    month?: number,
): Promise<IssueComparisonResult> {
    const supabase = await createClient();

    const today = getVietnamTodayUTC();

    let currentStart: Date;
    let currentEnd: Date;
    let previousStart: Date;
    let previousEnd: Date;
    let currentLabel: string;
    let previousLabel: string;

    if (period === "month") {
        const selectedYear = year ?? today.getUTCFullYear();
        const selectedMonth = month ?? today.getUTCMonth() + 1;

        if (
            !Number.isInteger(selectedYear) ||
            selectedYear < 2000 ||
            selectedYear > today.getUTCFullYear() ||
            !Number.isInteger(selectedMonth) ||
            selectedMonth < 1 ||
            selectedMonth > 12 ||
            getMonthStart(selectedYear, selectedMonth).getTime() >
                getMonthStart(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                ).getTime()
        ) {
            throw new Error("Tháng hoặc năm không hợp lệ.");
        }

        currentStart = getMonthStart(selectedYear, selectedMonth);
        currentEnd = getMonthStart(selectedYear, selectedMonth + 1);

        previousStart = getMonthStart(selectedYear, selectedMonth - 1);
        previousEnd = currentStart;

        currentLabel = `Tháng ${String(selectedMonth).padStart(2, "0")}/${selectedYear}`;
        previousLabel = `Tháng ${String(
            previousStart.getUTCMonth() + 1,
        ).padStart(2, "0")}/${previousStart.getUTCFullYear()}`;
    } else {
        currentStart = getDateOffset(today, -6);
        currentEnd = getDateOffset(today, 1);
        previousStart = getDateOffset(today, -13);
        previousEnd = currentStart;

        currentLabel = "7 ngày gần nhất";
        previousLabel = "7 ngày trước đó";
    }

    const { data, error } = await supabase
        .from("feedback")
        .select("selected_options, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", toVietnamDateTime(previousStart))
        .lt("created_at", toVietnamDateTime(currentEnd));

    if (error) {
        console.error("Failed to get issue comparison:", error);
        throw new Error("Không thể tải dữ liệu so sánh vấn đề.");
    }

    const currentCounts = new Map<string, number>();
    const previousCounts = new Map<string, number>();

    FEEDBACK_ISSUES.forEach(({ option }) => {
        currentCounts.set(option, 0);
        previousCounts.set(option, 0);
    });

    const currentStartTime = new Date(
        toVietnamDateTime(currentStart),
    ).getTime();

    const currentEndTime = new Date(toVietnamDateTime(currentEnd)).getTime();

    const previousEndTime = new Date(toVietnamDateTime(previousEnd)).getTime();

    data.forEach((feedback) => {
        const createdAt = new Date(feedback.created_at).getTime();

        const targetCounts =
            createdAt >= currentStartTime && createdAt < currentEndTime
                ? currentCounts
                : createdAt < previousEndTime
                  ? previousCounts
                  : null;

        if (!targetCounts) {
            return;
        }

        (feedback.selected_options ?? []).forEach((option: string) => {
            if (targetCounts.has(option)) {
                targetCounts.set(option, (targetCounts.get(option) ?? 0) + 1);
            }
        });
    });

    const comparisonData = FEEDBACK_ISSUES.map((issue) => ({
        option: issue.option,
        label: issue.label,
        currentCount: currentCounts.get(issue.option) ?? 0,
        previousCount: previousCounts.get(issue.option) ?? 0,
    })).sort(
        (a, b) =>
            b.currentCount - a.currentCount ||
            b.previousCount - a.previousCount,
    );

    return {
        period,
        currentLabel,
        previousLabel,
        data: comparisonData,
    };
}
