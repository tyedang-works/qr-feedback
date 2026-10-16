import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

function DonutSkeleton() {
    return (
        <Box
            sx={{
                position: "relative",
                width: 60,
                height: 60,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
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
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor: "#FFFFFF",
                    pointerEvents: "none",
                }}
            />
        </Box>
    );
}

function FeedbackSummaryCardSkeleton({ index }: { index: number }) {
    return (
        <Card elevation={0} sx={cardSx}>
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    justifyContent: "space-between",
                    gap: 1.5,
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
                        width={[100, 88, 100, 80][index]}
                        height={24}
                        animation="wave"
                        sx={{
                            transform: "none",
                            flex: "0 1 auto",
                            maxWidth: "100%",
                        }}
                    />

                    <DonutSkeleton />
                </Stack>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <Skeleton
                        variant="text"
                        width={index === 0 ? 54 : 42}
                        height={38}
                        animation="wave"
                        sx={{ transform: "none" }}
                    />
                </Stack>

                <Skeleton
                    variant="text"
                    width={index === 0 ? 145 : 155}
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

export default function FeedbackSummarySkeleton() {
    return (
        <Box
            aria-label="Đang tải thống kê phản hồi"
            role="status"
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.25, sm: 2 },
                width: "100%",
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {[0, 1, 2, 3].map((index) => (
                <FeedbackSummaryCardSkeleton key={index} index={index} />
            ))}
        </Box>
    );
}
