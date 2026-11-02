import { Box, Skeleton, Stack } from "@mui/material";

import FluidLoader from "@/components/common/loader/FluidLoader";
import FeedbackStatusChartSkeleton from "./FeedbackStatusChartSkeleton";
import FeedbackTrendSkeleton from "./FeedbackTrendSkeleton";
import IssueDistributionSkeleton from "./IssueDistributionSkeleton";
import RecentFeedbackSkeleton from "./RecentFeedbackSkeleton";
import SummaryCardsSkeleton from "./SummaryCardsSkeleton";

export default function DashboardSkeleton() {
    return (
        <Stack
            sx={{
                width: "100%",
                maxWidth: 1440,
                mx: "auto",
                gap: { xs: 2, md: 2.5 },
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                    alignItems: "stretch",
                    minWidth: 0,
                }}
            >
                <Box
                    sx={{
                        gridColumn: {
                            xs: "auto",
                            md: "span 2",
                        },
                        minWidth: 0,
                        minHeight: { xs: 300, md: 340 },
                        height: "100%",
                        p: { xs: 2, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 1.5,
                        border: "1px solid var(--color-border)",
                        borderRadius: "16px",
                        bgcolor: "var(--color-surface)",
                        boxShadow: "var(--shadow-card)",
                    }}
                >
                    <Skeleton
                        variant="text"
                        width="35%"
                        height={24}
                        sx={{ bgcolor: "var(--color-chart-track)" }}
                    />

                    <Skeleton
                        variant="text"
                        width="65%"
                        height={40}
                        sx={{ bgcolor: "var(--color-chart-track)" }}
                    />

                    <Skeleton
                        variant="text"
                        width="80%"
                        height={22}
                        sx={{ bgcolor: "var(--color-chart-track)" }}
                    />

                    <Skeleton
                        variant="text"
                        width="55%"
                        height={22}
                        sx={{ bgcolor: "var(--color-chart-track)" }}
                    />

                    <Skeleton
                        variant="rounded"
                        width={130}
                        height={38}
                        sx={{
                            mt: 1,
                            borderRadius: 2,
                            bgcolor: "var(--color-chart-track)",
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: {
                            xs: "auto",
                            md: "span 1",
                        },
                        minWidth: 0,
                        minHeight: { xs: 260, md: 340 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        p: { xs: 2, sm: 3 },
                        border: "1px solid var(--color-border)",
                        borderRadius: "16px",
                        bgcolor: "var(--color-surface)",
                        boxShadow: "var(--shadow-card)",
                    }}
                >
                    <FluidLoader />
                </Box>
            </Box>

            <SummaryCardsSkeleton />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                    alignItems: "stretch",
                    minWidth: 0,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <FeedbackTrendSkeleton />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <FeedbackStatusChartSkeleton />
                </Box>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "minmax(0, 7fr) minmax(0, 5fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",
                    minWidth: 0,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <RecentFeedbackSkeleton />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <IssueDistributionSkeleton />
                </Box>
            </Box>
        </Stack>
    );
}
