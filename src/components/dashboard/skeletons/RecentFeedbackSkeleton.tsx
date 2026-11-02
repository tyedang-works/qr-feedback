import { Box, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-donut-skeleton)",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-surface-hover), transparent)",
    },
};

const cardSx = {
    minWidth: 0,
    height: "100%",
    overflow: "hidden",
    border: "1px solid var(--color-border)",
    borderRadius: "16px",
    bgcolor: "var(--color-surface)",
    boxShadow: "var(--shadow-card)",
};

const FEEDBACK_SKELETON_ITEMS = [1, 2, 3, 4, 5];

function FeedbackItemSkeleton({ item }: { item: number }) {
    const hasLongTableName = item % 2 === 0;
    const commentWidth = item % 2 === 0 ? "72%" : "55%";

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "34px minmax(0, 1fr) auto",
                    sm: "34px minmax(180px, 1.15fr) minmax(0, 2fr) minmax(85px, auto)",
                },
                gridTemplateAreas: {
                    xs: `
                        "icon details time"
                        "icon comment comment"
                    `,
                    sm: `
                        "icon details comment time"
                    `,
                },
                alignItems: "center",
                columnGap: {
                    xs: 1.25,
                    sm: 2,
                    md: 2.5,
                },
                rowGap: {
                    xs: 0.75,
                    sm: 0,
                },
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1.75, sm: 2 },
                borderTop: "1px dashed var(--color-border)",
            }}
        >
            <Box
                sx={{
                    gridArea: "icon",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    bgcolor: "var(--color-surface-hover)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={23}
                    height={23}
                    sx={{
                        ...skeletonSx,
                        borderRadius: "5px",
                    }}
                />
            </Box>

            <Stack
                sx={{
                    gridArea: "details",
                    minWidth: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.75,
                }}
            >
                <Skeleton
                    variant="text"
                    width={hasLongTableName ? 78 : 62}
                    height={20}
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="rounded"
                    width={item % 2 === 0 ? 76 : 57}
                    height={21}
                    sx={{
                        ...skeletonSx,
                        flexShrink: 0,
                        borderRadius: "6px",
                    }}
                />
            </Stack>

            <Box
                sx={{
                    gridArea: "comment",
                    minWidth: 0,
                }}
            >
                <Skeleton
                    variant="text"
                    width={commentWidth}
                    height={19}
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />
            </Box>

            <Box
                sx={{
                    gridArea: "time",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <Skeleton
                    variant="text"
                    width={item % 2 === 0 ? 65 : 54}
                    height={17}
                    sx={{
                        ...skeletonSx,
                        flexShrink: 0,
                        transform: "none",
                    }}
                />
            </Box>
        </Box>
    );
}

export default function RecentFeedbackSkeleton() {
    return (
        <Box sx={cardSx}>
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
                <Box sx={{ minWidth: 0 }}>
                    <Skeleton
                        variant="text"
                        width={145}
                        height={28}
                        sx={{
                            ...skeletonSx,
                            transform: "none",
                        }}
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
