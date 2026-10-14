import { Box, Stack } from "@mui/material";

import FeedbackStatusChartSkeleton from "./FeedbackStatusChartSkeleton";
import FeedbackTrendSkeleton from "./FeedbackTrendSkeleton";
import IssueDistributionSkeleton from "./IssueDistributionSkeleton";
import RecentFeedbackSkeleton from "./RecentFeedbackSkeleton";
import SummaryCardsSkeleton from "./SummaryCardsSkeleton";

export default function DashboardSkeleton() {
    return (
        <Stack sx={{ gap: 2, minWidth: 0 }}>
            <SummaryCardsSkeleton />

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
                <FeedbackStatusChartSkeleton />
                <FeedbackTrendSkeleton />
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
                    <RecentFeedbackSkeleton />
                </Box>
                <Stack sx={{ gap: 2, minWidth: 0 }}>
                    <IssueDistributionSkeleton />
                </Stack>
            </Box>
        </Stack>
    );
}
