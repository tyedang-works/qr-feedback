import FeedbackTrend from "@/components/dashboard/FeedbackTrend";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { getUserContext } from "@/lib/auth/queries";

import IssueDistribution from "@/components/dashboard/IssueDistribution";
import RecentFeedback from "@/components/dashboard/RecentFeedback";
import {
    getDashboardSummary,
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

    const recentFeedback = userContext
        ? await getRecentFeedback(userContext.restaurantId)
        : [];

    return (
        <Stack sx={{ gap: 3 }}>
            <SummaryCards
                totalFeedback={summary.totalFeedback}
                todayFeedback={summary.todayFeedback}
                activeTables={summary.activeTables}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "minmax(0, 1.5fr) minmax(0, 1fr)",
                    },
                    gap: 2,
                }}
            >
                <FeedbackTrend data={feedbackTrend} />

                <IssueDistribution data={issueDistribution} />
            </Box>

            <RecentFeedback data={recentFeedback} />

            <RecentFeedback data={recentFeedback} />
        </Stack>
    );
}
