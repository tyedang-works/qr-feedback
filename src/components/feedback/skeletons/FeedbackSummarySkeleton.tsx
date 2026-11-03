import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-skeleton, rgba(145, 158, 171, 0.16))",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-skeleton-highlight, rgba(255, 255, 255, 0.12)), transparent)",
    },
};

const STATUS_COLORS = ["#193B56", "#EF4444", "#3B82F6", "#10B981"];

const TITLE_WIDTHS = [112, 88, 100, 112];
const DESCRIPTION_WIDTHS = [145, 130, 130, 145];
const VALUE_WIDTHS = [52, 42, 42, 42];

function SummaryDecorationSkeleton({ color }: { color: string }) {
    return (
        <Box
            aria-hidden="true"
            sx={{
                position: "absolute",
                width: {
                    xs: 145,
                    sm: 165,
                },
                height: {
                    xs: 145,
                    sm: 165,
                },
                right: {
                    xs: -55,
                    sm: -60,
                },
                bottom: {
                    xs: -105,
                    sm: -115,
                },
                borderRadius: {
                    xs: "22px",
                    sm: "26px",
                },
                transform: "rotate(40deg)",
                transformOrigin: "center",
                background: `linear-gradient(
                    135deg,
                    ${color}20 0%,
                    ${color}10 48%,
                    ${color}05 100%
                )`,
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}

function DonutSkeleton() {
    return (
        <Box
            sx={{
                position: "relative",
                width: 76,
                height: 76,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
            }}
        >
            <Skeleton
                variant="circular"
                width={76}
                height={76}
                animation="wave"
                sx={{
                    ...skeletonSx,
                    bgcolor: "var(--color-chart-track, #E5E7EB)",
                    opacity: 0.85,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    bgcolor: "var(--color-surface, #FFFFFF)",
                    pointerEvents: "none",
                }}
            />

            <Skeleton
                variant="text"
                width={28}
                height={13}
                animation="wave"
                sx={{
                    ...skeletonSx,
                    position: "absolute",
                    transform: "none",
                    top: "50%",
                    left: "50%",
                    translate: "-50% -50%",
                }}
            />
        </Box>
    );
}

function FeedbackSummaryCardSkeleton({ index }: { index: number }) {
    const color = STATUS_COLORS[index];

    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                position: "relative",
                overflow: "hidden",
                isolation: "isolate",
                minWidth: 0,
                minHeight: { xs: 185, sm: 196 },
                height: "100%",
                p: { xs: 2, sm: 2.5 },
                boxShadow: "var(--shadow-card)",
            }}
        >
            <SummaryDecorationSkeleton color={color} />

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    bgcolor: color,
                    opacity: 0.65,
                    zIndex: 2,
                }}
            />

            <Stack
                sx={{
                    position: "relative",
                    zIndex: 1,
                    minWidth: 0,
                    minHeight: 145,
                    height: "100%",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <Skeleton
                            variant="circular"
                            width={8}
                            height={8}
                            animation="wave"
                            sx={{
                                ...skeletonSx,
                                flexShrink: 0,
                            }}
                        />

                        <Skeleton
                            variant="text"
                            width={TITLE_WIDTHS[index]}
                            height={22}
                            animation="wave"
                            sx={{
                                ...skeletonSx,
                                transform: "none",
                                maxWidth: "100%",
                            }}
                        />
                    </Stack>

                    <DonutSkeleton />
                </Stack>

                <Skeleton
                    variant="text"
                    width={VALUE_WIDTHS[index]}
                    height={40}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    width={DESCRIPTION_WIDTHS[index]}
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
            role="status"
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.5, sm: 2 },
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
