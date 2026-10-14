import FeedbackStatusChart from "@/components/dashboard/FeedbackStatusChart";
import FeedbackTrend from "@/components/dashboard/FeedbackTrend";
import IssueDistribution from "@/components/dashboard/IssueDistribution";
import RecentFeedback from "@/components/dashboard/RecentFeedback";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { getUserContext } from "@/lib/auth/queries";
import {
    getDashboardSummary,
    getFeedbackStatusDistribution,
    getFeedbackTrend,
    getRecentFeedback,
    getSummaryComparison,
    getWeeklyIssueComparison,
} from "@/lib/dashboard/queries";
import { getRestaurantTableSummary } from "@/lib/tables/queries";
import { Box, Stack } from "@mui/material";

export default async function DashboardPage() {
    const userContext = await getUserContext();

    const restaurantId = userContext?.restaurantId;

    const emptySummary = {
        totalFeedback: 0,
        todayFeedback: 0,
        activeTables: 0,
        newFeedback: 0,
        inProgressFeedback: 0,
        resolvedFeedback: 0,
    };

    const emptySummaryComparison = {
        last7DaysFeedback: 0,
        previous7DaysFeedback: 0,
        yesterdayFeedback: 0,
    };

    const emptyTableSummary = {
        total: 0,
        active: 0,
        inactive: 0,
    };

    const [
        summary,
        feedbackTrend,
        issueComparison,
        feedbackStatusDistribution,
        recentFeedback,
        summaryComparison,
        tableSummary,
    ] = restaurantId
        ? await Promise.all([
              getDashboardSummary(restaurantId),
              getFeedbackTrend(restaurantId, 7),
              getWeeklyIssueComparison(restaurantId),
              getFeedbackStatusDistribution(restaurantId),
              getRecentFeedback(restaurantId),
              getSummaryComparison(restaurantId),
              getRestaurantTableSummary(restaurantId),
          ])
        : [
              emptySummary,
              [],
              [],
              [],
              [],
              emptySummaryComparison,
              emptyTableSummary,
          ];

    return (
        <Stack sx={{ gap: 2, minWidth: 0 }}>
            <SummaryCards
                totalFeedback={summary.totalFeedback}
                todayFeedback={summary.todayFeedback}
                activeTables={tableSummary.active}
                inactiveTables={tableSummary.inactive}
                feedbackTrend={feedbackTrend}
                last7DaysFeedback={summaryComparison.last7DaysFeedback}
                previous7DaysFeedback={summaryComparison.previous7DaysFeedback}
                yesterdayFeedback={summaryComparison.yesterdayFeedback}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1fr) minmax(0, 1.5fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",
                    minWidth: 0,
                }}
            >
                <FeedbackStatusChart data={feedbackStatusDistribution} />
                <FeedbackTrend data={feedbackTrend} />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1.5fr) minmax(0, 1fr)",
                    },
                    gap: 2,
                    alignItems: "start",
                    minWidth: 0,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <RecentFeedback data={recentFeedback} />
                </Box>
                <Stack sx={{ gap: 2, minWidth: 0 }}>
                    <IssueDistribution data={issueComparison} />
                </Stack>
            </Box>
        </Stack>
    );
}
