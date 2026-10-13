import { Box, Skeleton, Stack } from "@mui/material";

const cardSx = {
    p: { xs: 2, sm: 2.5 },
    border: "1px solid #E5E7EB",
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
    minWidth: 0,
    height: "100%",
};

function SummaryCardsSkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
            }}
        >
            {[1, 2, 3].map((item) => (
                <Box key={item} sx={cardSx}>
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Skeleton
                            variant="circular"
                            width={44}
                            height={44}
                            sx={{ flexShrink: 0 }}
                        />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Skeleton
                                variant="text"
                                width={item === 3 ? 145 : 110}
                                height={20}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={65}
                                height={34}
                                sx={{
                                    mt: 0.5,
                                    transform: "none",
                                }}
                            />
                        </Box>
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}

function ChartCardHeaderSkeleton({
    showPeriodFilters = false,
    stackedOnMobile = false,
}: {
    showPeriodFilters?: boolean;
    stackedOnMobile?: boolean;
}) {
    return (
        <>
            <Stack
                sx={{
                    flexDirection: {
                        xs: stackedOnMobile ? "column" : "row",
                        sm: "row",
                    },
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="text"
                    width={160}
                    height={24}
                    sx={{ transform: "none" }}
                />

                {showPeriodFilters && (
                    <Stack
                        sx={{
                            flexDirection: "row",
                            gap: 0.75,
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={66}
                            height={30}
                            sx={{ borderRadius: 1.5 }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={70}
                            height={30}
                            sx={{ borderRadius: 1.5 }}
                        />
                    </Stack>
                )}
            </Stack>

            <Skeleton
                variant="text"
                width={220}
                height={20}
                sx={{
                    mt: 0.5,
                    transform: "none",
                }}
            />
        </>
    );
}

function FeedbackTrendSkeleton() {
    return (
        <Box sx={cardSx}>
            <ChartCardHeaderSkeleton showPeriodFilters stackedOnMobile />

            <Box
                sx={{
                    mt: 2,
                    width: "100%",
                    height: 240,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Y-axis labels and chart area */}
                <Stack
                    sx={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 1,
                        minHeight: 0,
                    }}
                >
                    <Stack
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            pb: 0.5,
                        }}
                    >
                        {[1, 2, 3, 4].map((item) => (
                            <Skeleton
                                key={item}
                                variant="text"
                                width={18}
                                height={14}
                                sx={{ transform: "none" }}
                            />
                        ))}
                    </Stack>

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            alignItems: "stretch",
                            position: "relative",
                            borderBottom: "1px solid #EAECF0",
                            backgroundImage:
                                "repeating-linear-gradient(to bottom, transparent 0px, transparent 49px, #EAECF0 50px, transparent 51px)",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                inset: "12% 0 18% 0",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <svg
                                viewBox="0 0 300 150"
                                preserveAspectRatio="none"
                                width="100%"
                                height="100%"
                                style={{ overflow: "visible" }}
                            >
                                <polyline
                                    points="0,112 50,88 100,102 150,45 200,72 250,24 300,52"
                                    fill="none"
                                    stroke="#D8E1E9"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {[
                                    [0, 112],
                                    [50, 88],
                                    [100, 102],
                                    [150, 45],
                                    [200, 72],
                                    [250, 24],
                                    [300, 52],
                                ].map(([cx, cy], index) => (
                                    <circle
                                        key={index}
                                        cx={cx}
                                        cy={cy}
                                        r="4"
                                        fill="#D8E1E9"
                                    />
                                ))}
                            </svg>
                        </Box>
                    </Box>
                </Stack>

                <Stack
                    sx={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        pl: 3.5,
                        pt: 0.5,
                    }}
                >
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                        <Skeleton
                            key={item}
                            variant="text"
                            width={20}
                            height={16}
                            sx={{ transform: "none" }}
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

function FeedbackStatusSkeleton() {
    return (
        <Box sx={cardSx}>
            <ChartCardHeaderSkeleton />

            <Box
                sx={{
                    mt: 1,
                    width: "100%",
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: 158,
                        height: 158,
                        borderRadius: "50%",
                        border: "26px solid #EAECF0",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: -26,
                            borderRadius: "50%",
                            border: "26px solid transparent",
                            borderTopColor: "#D8E1E9",
                            transform: "rotate(-35deg)",
                        }}
                    />
                </Box>
            </Box>

            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: { xs: 1, sm: 1.5 },
                    mt: 0.5,
                    mb: 1,
                }}
            >
                {[1, 2, 3].map((item) => (
                    <Stack
                        key={item}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        <Skeleton variant="circular" width={8} height={8} />
                        <Skeleton
                            variant="text"
                            width={item === 2 ? 68 : 58}
                            height={18}
                            sx={{ transform: "none" }}
                        />
                    </Stack>
                ))}
            </Stack>

            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: 1.5,
                    mt: 1,
                    borderTop: "1px solid #EAECF0",
                }}
            >
                <Skeleton
                    variant="text"
                    width={125}
                    height={20}
                    sx={{ transform: "none" }}
                />
                <Skeleton
                    variant="text"
                    width={42}
                    height={24}
                    sx={{ transform: "none" }}
                />
            </Stack>
        </Box>
    );
}

function IssueDistributionSkeleton() {
    return (
        <Box sx={cardSx}>
            <ChartCardHeaderSkeleton />

            <Box
                sx={{
                    mt: 2,
                    width: "100%",
                    height: 240,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    gap: 1,
                }}
            >
                {[
                    { labelWidth: "78%", barWidth: "65%" },
                    { labelWidth: "92%", barWidth: "85%" },
                    { labelWidth: "68%", barWidth: "48%" },
                    { labelWidth: "86%", barWidth: "72%" },
                    { labelWidth: "72%", barWidth: "38%" },
                ].map((item, index) => (
                    <Stack
                        key={index}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: 95, sm: 160 },
                                flexShrink: 0,
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width={item.labelWidth}
                                height={18}
                                sx={{ transform: "none" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px dashed #EAECF0",
                                minWidth: 0,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                width={item.barWidth}
                                height={20}
                                sx={{ borderRadius: "0 5px 5px 0" }}
                            />
                        </Box>
                    </Stack>
                ))}
            </Box>
        </Box>
    );
}

function RecentFeedbackSkeleton() {
    return (
        <Box
            sx={{
                ...cardSx,
                p: 0,
                overflow: "hidden",
                borderRadius: 2,
            }}
        >
            {/* Header */}
            <Stack
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton
                        variant="text"
                        width={155}
                        height={24}
                        sx={{ transform: "none" }}
                    />
                    <Skeleton
                        variant="text"
                        width={145}
                        height={20}
                        sx={{
                            mt: 0.5,
                            transform: "none",
                        }}
                    />
                </Box>

                <Skeleton
                    variant="text"
                    width={88}
                    height={20}
                    sx={{ flexShrink: 0, transform: "none" }}
                />
            </Stack>

            {/* Feedback rows */}
            {[1, 2, 3, 4, 5].map((item) => (
                <Box
                    key={item}
                    sx={{
                        px: { xs: 2, sm: 2.5 },
                        py: 1.5,
                        borderTop: "1px solid #EAECF0",
                    }}
                >
                    <Stack sx={{ gap: 1.25 }}>
                        <Stack
                            sx={{
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                },
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Skeleton
                                    variant="text"
                                    width={item % 2 === 0 ? 110 : 85}
                                    height={21}
                                    sx={{ transform: "none" }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={90}
                                    height={17}
                                    sx={{ transform: "none" }}
                                />
                            </Box>

                            <Skeleton
                                variant="rounded"
                                width={item % 2 === 0 ? 86 : 76}
                                height={26}
                                sx={{
                                    flexShrink: 0,
                                    borderRadius: 1,
                                }}
                            />
                        </Stack>

                        <Stack
                            sx={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 0.75,
                            }}
                        >
                            {[1, 2].map((chip) => (
                                <Skeleton
                                    key={chip}
                                    variant="rounded"
                                    width={chip === 1 ? 94 : 78}
                                    height={26}
                                    sx={{ borderRadius: 1 }}
                                />
                            ))}
                        </Stack>

                        <Skeleton
                            variant="text"
                            width={item % 2 === 0 ? "78%" : "92%"}
                            height={20}
                            sx={{ transform: "none" }}
                        />
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}

export default function DashboardLoading() {
    return (
        <Stack
            aria-label="Đang tải dashboard"
            sx={{
                gap: 2,
                width: "100%",
                minWidth: 0,
            }}
        >
            <SummaryCardsSkeleton />

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
                <FeedbackTrendSkeleton />
                <FeedbackStatusSkeleton />
            </Box>

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
                <IssueDistributionSkeleton />
                <RecentFeedbackSkeleton />
            </Box>
        </Stack>
    );
}
