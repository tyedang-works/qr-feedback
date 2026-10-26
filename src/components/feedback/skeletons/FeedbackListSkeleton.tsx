import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-skeleton, rgba(145, 158, 171, 0.16))",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-skeleton-highlight, rgba(255, 255, 255, 0.12)), transparent)",
    },
};

const dividerColor = "var(--color-border)";

export default function FeedbackListSkeleton() {
    return (
        <Card
            sx={{
                ...cardSx,
                overflow: "hidden",
                boxShadow: "none",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.75,
                    borderBottom: `1px solid ${dividerColor}`,
                }}
            >
                <Skeleton
                    variant="text"
                    width={150}
                    height={22}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    width={200}
                    height={19}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        mt: 0.25,
                        transform: "none",
                    }}
                />
            </Box>

            {[1, 2, 3, 4].map((item) => (
                <Box
                    key={item}
                    sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                            item < 4 ? `1px solid ${dividerColor}` : "none",
                        bgcolor:
                            item === 1
                                ? "var(--color-surface-active)"
                                : "transparent",
                        borderLeft:
                            item === 1
                                ? "2px solid var(--color-text-secondary)"
                                : "2px solid transparent",
                    }}
                >
                    <Stack sx={{ gap: 1 }}>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Skeleton
                                    variant="text"
                                    width={70}
                                    height={21}
                                    animation="wave"
                                    sx={{
                                        ...skeletonSx,
                                        transform: "none",
                                    }}
                                />
                            </Box>

                            <Skeleton
                                variant="text"
                                width={90}
                                height={18}
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    transform: "none",
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
                            <Skeleton
                                variant="rounded"
                                width={item === 2 ? 88 : 42}
                                height={22}
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    borderRadius: 1,
                                }}
                            />

                            <Skeleton
                                variant="rounded"
                                width={125}
                                height={22}
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    borderRadius: 1,
                                }}
                            />

                            <Skeleton
                                variant="rounded"
                                width={100}
                                height={22}
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    borderRadius: 1,
                                }}
                            />
                        </Stack>

                        <Skeleton
                            variant="text"
                            width={item === 2 ? "75%" : "45%"}
                            height={20}
                            animation="wave"
                            sx={{
                                ...skeletonSx,
                                transform: "none",
                            }}
                        />

                        <Skeleton
                            variant="text"
                            width={135}
                            height={19}
                            animation="wave"
                            sx={{
                                ...skeletonSx,
                                transform: "none",
                            }}
                        />
                    </Stack>
                </Box>
            ))}
        </Card>
    );
}
