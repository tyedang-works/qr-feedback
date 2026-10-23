import { Box, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-donut-skeleton)",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-surface-hover), transparent)",
    },
};

const cardSx = {
    p: { xs: 2, sm: 2.5 },
    border: "1px solid var(--color-border)",
    borderRadius: 2.5,
    backgroundColor: "var(--color-surface)",
    minWidth: 0,
    height: "100%",
};

const FEEDBACK_SKELETON_ITEMS = [1, 2, 3, 4, 5];

function FeedbackItemSkeleton({ item }: { item: number }) {
    const chipCount = item % 3 === 0 ? 2 : item % 2 === 0 ? 0 : 2;

    return (
        <Box
            sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1.5,
                borderTop: "1px solid var(--color-border)",
            }}
        >
            <Stack sx={{ gap: 0.75 }}>
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1.25,
                            minWidth: 0,
                            flex: 1,
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={34}
                            height={34}
                            sx={{
                                ...skeletonSx,
                                flexShrink: 0,
                                borderRadius: "9px",
                            }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Skeleton
                                variant="text"
                                width={65}
                                height={20}
                                sx={{ ...skeletonSx, transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={68}
                                height={17}
                                sx={{ ...skeletonSx, transform: "none" }}
                            />
                        </Box>
                    </Stack>

                    <Skeleton
                        variant="rounded"
                        width={item % 2 === 0 ? 80 : 68}
                        height={23}
                        sx={{
                            ...skeletonSx,
                            flexShrink: 0,
                            borderRadius: "6px",
                        }}
                    />
                </Stack>

                {chipCount > 0 && (
                    <Stack
                        sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 0.5,
                            pl: { xs: 0, sm: "46px" },
                        }}
                    >
                        {Array.from({ length: chipCount }, (_, index) => (
                            <Skeleton
                                key={index}
                                variant="rounded"
                                width={index === 0 ? 145 : 100}
                                height={25}
                                sx={{
                                    ...skeletonSx,
                                    borderRadius: "6px",
                                }}
                            />
                        ))}

                        {item === 3 && (
                            <Skeleton
                                variant="rounded"
                                width={29}
                                height={25}
                                sx={{
                                    ...skeletonSx,
                                    borderRadius: "6px",
                                }}
                            />
                        )}
                    </Stack>
                )}

                <Skeleton
                    variant="text"
                    width={item % 2 === 0 ? "48%" : "30%"}
                    height={19}
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                        ml: { xs: 0, sm: "46px" },
                    }}
                />
            </Stack>
        </Box>
    );
}

export default function RecentFeedbackSkeleton() {
    return (
        <Box
            sx={{
                ...cardSx,
                p: 0,
                minWidth: 0,
                overflow: "hidden",
                borderRadius: "16px",
                bgcolor: "var(--color-surface)",
            }}
        >
            <Stack
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 1.75,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton
                        variant="text"
                        width={145}
                        height={24}
                        sx={{ ...skeletonSx, transform: "none" }}
                    />

                    <Skeleton
                        variant="text"
                        width={115}
                        height={18}
                        sx={{
                            ...skeletonSx,
                            mt: 0.25,
                            transform: "none",
                        }}
                    />
                </Box>

                <Skeleton
                    variant="text"
                    width={76}
                    height={20}
                    sx={{
                        ...skeletonSx,
                        flexShrink: 0,
                        transform: "none",
                    }}
                />
            </Stack>

            {FEEDBACK_SKELETON_ITEMS.map((item) => (
                <FeedbackItemSkeleton key={item} item={item} />
            ))}
        </Box>
    );
}
