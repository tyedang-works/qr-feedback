import { Box, Skeleton, Stack } from "@mui/material";

const cardSx = {
    p: { xs: 2, sm: 2.5 },
    border: "1px solid #E5E7EB",
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
    minWidth: 0,
};

function ChartSkeleton({ showFilters = false }: { showFilters?: boolean }) {
    return (
        <Box sx={cardSx}>
            <Stack
                sx={{
                    gap: 0.75,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                }}
            >
                <Box>
                    <Skeleton
                        variant="text"
                        width={170}
                        height={24}
                        sx={{ transform: "none" }}
                    />

                    <Skeleton
                        variant="text"
                        width={220}
                        height={20}
                        sx={{ transform: "none" }}
                    />
                </Box>

                {showFilters && (
                    <Stack
                        sx={{
                            flexDirection: "row",
                            gap: 1,
                        }}
                    >
                        <Skeleton variant="rounded" width={65} height={30} />
                        <Skeleton variant="rounded" width={65} height={30} />
                    </Stack>
                )}
            </Stack>

            <Box
                sx={{
                    mt: 2,
                    height: 240,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1.5,
                    px: 1,
                    pb: 2,
                    borderBottom: "1px solid #EAECF0",
                }}
            >
                {[35, 55, 42, 72, 48, 85, 62].map((height, index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        width="100%"
                        height={`${height}%`}
                        sx={{
                            transform: "none",
                            borderRadius: 1,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}

function RecentFeedbackSkeleton() {
    return (
        <Box sx={cardSx}>
            <Skeleton
                variant="text"
                width={180}
                height={24}
                sx={{ transform: "none" }}
            />

            <Skeleton
                variant="text"
                width={220}
                height={20}
                sx={{ transform: "none" }}
            />

            <Stack sx={{ mt: 2, gap: 1.5 }}>
                {[1, 2, 3, 4].map((item) => (
                    <Stack
                        key={item}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1.5,
                            py: 1,
                            borderBottom: "1px solid #EAECF0",
                        }}
                    >
                        <Skeleton variant="rounded" width={40} height={40} />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Skeleton
                                variant="text"
                                width="65%"
                                height={20}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width="90%"
                                height={18}
                                sx={{ transform: "none" }}
                            />
                        </Box>

                        <Skeleton variant="rounded" width={68} height={24} />
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

export default function DashboardLoading() {
    return (
        <Stack sx={{ gap: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                }}
            >
                {[1, 2, 3].map((item) => (
                    <Box key={item} sx={cardSx}>
                        <Skeleton
                            variant="text"
                            width={130}
                            height={22}
                            sx={{ transform: "none" }}
                        />

                        <Skeleton
                            variant="text"
                            width={100}
                            height={38}
                            sx={{ transform: "none", mt: 1 }}
                        />
                    </Box>
                ))}
            </Box>

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
                <ChartSkeleton showFilters />

                <ChartSkeleton />
            </Box>

            {/* Row 2: Issue distribution and recent feedback */}
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
                <ChartSkeleton />

                <RecentFeedbackSkeleton />
            </Box>
        </Stack>
    );
}
