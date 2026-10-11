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
    getIssueDistribution,
    getRecentFeedback,
} from "@/lib/dashboard/queries";
import { Box, Stack } from "@mui/material";

export default async function DashboardPage() {
    const userContext = await getUserContext();

    const summary = userContext
        ? await getDashboardSummary(userContext.restaurantId)
        : {
              totalFeedback: 0,
              todayFeedback: 0,
              activeTables: 0,
          };

    const feedbackTrend = userContext
        ? await getFeedbackTrend(userContext.restaurantId)
        : [];

    const issueDistribution = userContext
        ? await getIssueDistribution(userContext.restaurantId)
        : [];

    const feedbackStatusDistribution = userContext
        ? await getFeedbackStatusDistribution(userContext.restaurantId)
        : [];

    const recentFeedback = userContext
        ? await getRecentFeedback(userContext.restaurantId)
        : [];

    return (
        <Stack sx={{ gap: 2 }}>
            <SummaryCards
                totalFeedback={summary.totalFeedback}
                todayFeedback={summary.todayFeedback}
                activeTables={summary.activeTables}
            />

            {/* Hàng 1: Xu hướng phản hồi và trạng thái xử lý */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1.35fr) minmax(0, 1fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",
                    minWidth: 0,
                }}
            >
                <FeedbackTrend data={feedbackTrend} />

                <FeedbackStatusChart data={feedbackStatusDistribution} />
            </Box>

            {/* Hàng 2: Phân bố vấn đề và phản hồi gần đây */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1fr) minmax(0, 1.35fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",
                    minWidth: 0,
                }}
            >
                <IssueDistribution data={issueDistribution} />

                <RecentFeedback data={recentFeedback} />
            </Box>
        </Stack>
    );
}
