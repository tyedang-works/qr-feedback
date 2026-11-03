import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

function DonutSkeleton() {
    return (
        <Box
            sx={{
                position: "relative",
                width: { xs: 132, sm: 148 },
                height: { xs: 132, sm: 148 },
                flexShrink: 0,
            }}
        >
            <Skeleton
                variant="circular"
                animation="wave"
                sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "var(--color-donut-skeleton)",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    inset: "9%",
                    borderRadius: "50%",
                    bgcolor: "var(--color-surface)",
                }}
            />

            <Skeleton
                variant="circular"
                animation="wave"
                sx={{
                    position: "absolute",
                    inset: "17%",
                    width: "66%",
                    height: "66%",
                    bgcolor: "var(--color-donut-skeleton)",
                }}
            />

            <Stack
                sx={{
                    position: "absolute",
                    inset: "25%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "var(--color-surface)",
                    gap: 0.25,
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    width={48}
                    height={14}
                    sx={{
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    width={32}
                    height={30}
                    sx={{
                        transform: "none",
                    }}
                />
            </Stack>
        </Box>
    );
}

function SummaryLegendSkeleton() {
    return (
        <Stack
            sx={{
                width: "100%",
                maxWidth: {
                    xs: "100%",
                    sm: 320,
                },
                minWidth: 0,
            }}
        >
            {[0, 1].map((item) => (
                <Box key={item}>
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            py: 1.5,
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                                minWidth: 0,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={10}
                                height={10}
                                animation="wave"
                                sx={{
                                    flexShrink: 0,
                                    bgcolor: "var(--color-donut-skeleton)",
                                }}
                            />

                            <Stack sx={{ gap: 0.25 }}>
                                <Skeleton
                                    variant="text"
                                    width={75}
                                    height={19}
                                    animation="wave"
                                    sx={{
                                        transform: "none",
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    width={65}
                                    height={17}
                                    animation="wave"
                                    sx={{
                                        transform: "none",
                                    }}
                                />
                            </Stack>
                        </Stack>

                        <Skeleton
                            variant="text"
                            width={34}
                            height={22}
                            animation="wave"
                            sx={{
                                transform: "none",
                            }}
                        />
                    </Stack>

                    {item === 0 && (
                        <Box
                            sx={{
                                borderTop: "1px solid var(--color-border)",
                            }}
                        />
                    )}
                </Box>
            ))}
        </Stack>
    );
}

export default function TablesSummarySkeleton() {
    return (
        <Card
            elevation={0}
            aria-label="Đang tải thống kê bàn"
            role="status"
            sx={{
                ...cardSx,
                p: {
                    xs: 2,
                    sm: 2.5,
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                    maxWidth: {
                        xs: "100%",
                        sm: 540,
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: {
                        xs: 2.5,
                        sm: 5,
                    },
                }}
            >
                <DonutSkeleton />
                <SummaryLegendSkeleton />
            </Stack>
        </Card>
    );
}
