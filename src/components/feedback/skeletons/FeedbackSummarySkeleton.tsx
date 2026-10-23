import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-skeleton, rgba(145, 158, 171, 0.16))",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-skeleton-highlight, rgba(255, 255, 255, 0.12)), transparent)",
    },
};

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
                sx={skeletonSx}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor: "var(--color-surface, #FFFFFF)",
                    pointerEvents: "none",
                }}
            />
        </Box>
    );
}

function FeedbackSummaryCardSkeleton({ index }: { index: number }) {
    const titleWidths = [100, 88, 100, 80];
    const descriptionWidths = [145, 155, 155, 145];

    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                boxShadow: "none",
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
                        width={titleWidths[index]}
                        height={24}
                        animation="wave"
                        sx={{
                            ...skeletonSx,
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
                        sx={{
                            ...skeletonSx,
                            transform: "none",
                        }}
                    />
                </Stack>

                <Skeleton
                    variant="text"
                    width={descriptionWidths[index]}
                    height={18}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
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
