import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const SUMMARY_ITEMS = [
    {
        titleWidth: 100,
        valueWidth: 54,
        descriptionWidth: 145,
    },
    {
        titleWidth: 110,
        valueWidth: 42,
        descriptionWidth: 155,
    },
    {
        titleWidth: 65,
        valueWidth: 42,
        descriptionWidth: 130,
    },
] as const;

function DonutSkeleton() {
    return (
        <Box
            sx={{
                position: "relative",
                width: 60,
                height: 60,
                flexShrink: 0,
            }}
        >
            <Skeleton
                variant="circular"
                width={60}
                height={60}
                animation="wave"
                sx={{
                    bgcolor: "#EAECF0",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor: "#FFFFFF",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                }}
            />
        </Box>
    );
}

function TablesSummaryCardSkeleton({ index }: { index: number }) {
    const item = SUMMARY_ITEMS[index];

    return (
        <Card elevation={0} sx={{ ...cardSx, p: { xs: 1.75, sm: 2.5 } }}>
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    justifyContent: "space-between",
                    gap: 0.5,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                        minWidth: 0,
                    }}
                >
                    <Skeleton
                        variant="text"
                        width={item.titleWidth}
                        height={23}
                        animation="wave"
                        sx={{
                            transform: "none",
                            maxWidth: "100%",
                        }}
                    />
                    <DonutSkeleton />
                </Stack>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        minWidth: 0,
                    }}
                >
                    <Skeleton
                        variant="text"
                        width={item.valueWidth}
                        height={36}
                        animation="wave"
                        sx={{
                            transform: "none",
                        }}
                    />
                </Stack>

                <Skeleton
                    variant="text"
                    width={item.descriptionWidth}
                    height={18}
                    animation="wave"
                    sx={{
                        transform: "none",
                        maxWidth: "100%",
                    }}
                />
            </Stack>
        </Card>
    );
}

export default function TablesSummarySkeleton() {
    return (
        <Box
            aria-label="Đang tải thống kê bàn"
            role="status"
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 1.25, sm: 2 },
                width: "100%",
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {SUMMARY_ITEMS.map((item, index) => (
                <TablesSummaryCardSkeleton
                    key={item.titleWidth}
                    index={index}
                />
            ))}
        </Box>
    );
}
