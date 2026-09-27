import { createClient } from "@/lib/supabase/server";
import type {
    FeedbackTrendItem,
    IssueDistributionItem,
    RecentFeedbackItem,
} from "./types";
import {
    FEEDBACK_ISSUES,
} from "./constants";

export type DashboardSummary = {
    totalFeedback: number;
    todayFeedback: number;
    activeTables: number;
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

    const startOfToday =
        `${vietnamDate}T00:00:00+07:00`;

    const endOfToday = new Date(
        new Date(startOfToday).getTime() +
        24 * 60 * 60 * 1000,
    ).toISOString();

    const [
        totalFeedbackResult,
        todayFeedbackResult,
        activeTablesResult,
    ] = await Promise.all([
        supabase
            .from("feedback")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("restaurant_id", restaurantId),

        supabase
            .from("feedback")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("restaurant_id", restaurantId)
            .gte("created_at", startOfToday)
            .lt("created_at", endOfToday),

        supabase
            .from("tables")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true),
    ]);

    if (totalFeedbackResult.error) {
        console.error(
            "Failed to get total feedback:",
            totalFeedbackResult.error,
        );
    }

    if (todayFeedbackResult.error) {
        console.error(
            "Failed to get today's feedback:",
            todayFeedbackResult.error,
        );
    }

    if (activeTablesResult.error) {
        console.error(
            "Failed to get active tables:",
            activeTablesResult.error,
        );
    }

    return {
        totalFeedback: totalFeedbackResult.count ?? 0,
        todayFeedback: todayFeedbackResult.count ?? 0,
        activeTables: activeTablesResult.count ?? 0,
    };
}

export async function getFeedbackTrend(
    restaurantId: string,
): Promise<FeedbackTrendItem[]> {
    const supabase = await createClient();

    const now = new Date();

    const vietnamFormatter = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        },
    );

    const dates: string[] = [];

    for (let index = 6; index >= 0; index -= 1) {
        const date = new Date(now);

        date.setDate(
            date.getDate() - index,
        );

        dates.push(
            vietnamFormatter.format(date),
        );
    }

    const startOfPeriod =
        `${dates[0]}T00:00:00+07:00`;

    const { data, error } = await supabase
        .from("feedback")
        .select("created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", startOfPeriod);

    if (error) {
        console.error(
            "Failed to get feedback trend:",
            error,
        );

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
        const date = new Date(
            feedback.created_at,
        );

        const dateString =
            vietnamFormatter.format(date);

        if (countByDate.has(dateString)) {
            countByDate.set(
                dateString,
                (countByDate.get(dateString) ?? 0) + 1,
            );
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
        console.error(
            "Failed to get issue distribution:",
            error,
        );

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
        feedback.selected_options.forEach(
            (option: string) => {
                if (countByOption.has(option)) {
                    countByOption.set(
                        option,
                        (countByOption.get(option) ?? 0) + 1,
                    );
                }
            },
        );
    });

    const totalSelections = Array.from(
        countByOption.values(),
    ).reduce(
        (total, count) => total + count,
        0,
    );

    return FEEDBACK_ISSUES.map((issue) => {
        const count =
            countByOption.get(issue.option) ?? 0;

        return {
            option: issue.option,
            label: issue.label,
            count,
            percentage:
                totalSelections > 0
                    ? Math.round(
                        (count / totalSelections) * 100,
                    )
                    : 0,
        };
    });
}

export async function getRecentFeedback(
    restaurantId: string,
): Promise<RecentFeedbackItem[]> {
    const supabase = await createClient();

    const { data: feedbackData, error: feedbackError } =
        await supabase
            .from("feedback")
            .select(
                "id, table_id, selected_options, feedback, created_at",
            )
            .eq("restaurant_id", restaurantId)
            .order("created_at", {
                ascending: false,
            })
            .limit(5);

    if (feedbackError) {
        console.error(
            "Failed to get recent feedback:",
            feedbackError,
        );

        return [];
    }

    if (!feedbackData.length) {
        return [];
    }

    const tableIds = [
        ...new Set(
            feedbackData.map(
                (item) => item.table_id,
            ),
        ),
    ];

    const { data: tablesData, error: tablesError } =
        await supabase
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

    return feedbackData.map((item) => ({
        id: item.id,
        tableName:
            tableNameMap.get(item.table_id) ??
            "Không xác định",
        selectedOptions:
            item.selected_options ?? [],
        feedback: item.feedback ?? "",
        createdAt: item.created_at,
    }));
}