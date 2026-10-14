import { Box, Card, Skeleton, Stack } from "@mui/material";

const SUMMARY_CARD_CONFIG = [
    {
        labelWidth: 95,
        valueWidth: 42,
        chartColor: "#10B981",
        chartHeights: [12, 4, 8, 3, 5, 2, 4],
        comparisonWidth: 165,
    },
    {
        labelWidth: 48,
        valueWidth: 28,
        chartColor: "#06B6D4",
        chartHeights: [3, 15, 5, 9, 3, 2, 4],
        comparisonWidth: 135,
    },
    {
        labelWidth: 135,
        valueWidth: 68,
        chartColor: "#F97316",
        chartHeights: [30, 4],
        comparisonWidth: 150,
    },
];

function MiniBarChartSkeleton({
    heights,
    color,
}: {
    heights: number[];
    color: string;
}) {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                gap: "3px",
                width: 60,
                height: 36,
                flexShrink: 0,
                borderBottom: "1px dashed #D0D5DD",
            }}
        >
            {heights.map((height, index) => (
                <Skeleton
                    key={index}
                    variant="rounded"
                    animation="wave"
                    sx={{
                        flex: "1 1 0",
                        minWidth: 3,
                        maxWidth: 5,
                        height: `${height * 2}px`,
                        bgcolor: color,
                        opacity: 0.55,
                        borderRadius: "2px 2px 0 0",
                        transform: "none",
                    }}
                />
            ))}
        </Stack>
    );
}

function SummaryCardSkeleton({
    labelWidth,
    valueWidth,
    chartColor,
    chartHeights,
    comparisonWidth,
}: (typeof SUMMARY_CARD_CONFIG)[number]) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                p: { xs: 2, sm: 2.5 },
                border: "1px solid var(--color-border, #F0F2F5)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    justifyContent: "space-between",
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="text"
                    width={labelWidth}
                    height={20}
                    sx={{ transform: "none" }}
                />

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 0,
                    }}
                >
                    <Skeleton
                        variant="text"
                        width={valueWidth}
                        height={38}
                        sx={{ transform: "none" }}
                    />

                    <MiniBarChartSkeleton
                        heights={chartHeights}
                        color={chartColor}
                    />
                </Stack>

                <Box
                    sx={{
                        minWidth: 0,
                        minHeight: 18,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Skeleton
                        variant="text"
                        width={comparisonWidth}
                        height={19}
                        sx={{
                            maxWidth: "100%",
                            transform: "none",
                        }}
                    />
                </Box>
            </Stack>
        </Card>
    );
}

export default function SummaryCardsSkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {SUMMARY_CARD_CONFIG.map((config, index) => (
                <SummaryCardSkeleton key={index} {...config} />
            ))}
        </Box>
    );
}
