import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-skeleton, rgba(145, 158, 171, 0.16))",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-skeleton-highlight, rgba(255, 255, 255, 0.12)), transparent)",
    },
};

const FeedbackSkeletonCard = ({ index }: { index: number }) => {
    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                minHeight: 244,
                p: 2,
                boxShadow: "none",
                overflow: "hidden",
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Skeleton
                    variant="text"
                    width={index % 3 === 0 ? 75 : 68}
                    height={22}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="rounded"
                    width={index % 2 === 0 ? 88 : 78}
                    height={23}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        borderRadius: 1,
                        flexShrink: 0,
                    }}
                />
            </Stack>

            <Skeleton
                variant="text"
                width={95}
                height={19}
                animation="wave"
                sx={{
                    ...skeletonSx,
                    mt: 0.75,
                    transform: "none",
                }}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.75,
                    mt: 1.25,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={index % 2 === 0 ? 132 : 118}
                    height={28}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    width={index % 3 === 0 ? 142 : 126}
                    height={28}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    width={28}
                    height={24}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        borderRadius: 1,
                    }}
                />
            </Stack>

            <Stack sx={{ gap: 0.25, mt: 1.25 }}>
                <Skeleton
                    variant="text"
                    width={index % 2 === 0 ? "95%" : "75%"}
                    height={21}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    width={index % 3 === 0 ? "65%" : "40%"}
                    height={21}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        transform: "none",
                    }}
                />
            </Stack>

            <Stack
                sx={{
                    mt: "auto",
                    pt: 1.25,
                    borderTop: "1px solid var(--color-border)",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Stack
                    sx={{
                        minWidth: 0,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 0.75,
                    }}
                >
                    <Skeleton
                        variant="circular"
                        width={15}
                        height={15}
                        animation="wave"
                        sx={skeletonSx}
                    />

                    <Skeleton
                        variant="text"
                        width={index % 2 === 0 ? 105 : 115}
                        height={19}
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            transform: "none",
                        }}
                    />
                </Stack>

                <Skeleton
                    variant="text"
                    width={112}
                    height={20}
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        flexShrink: 0,
                        transform: "none",
                    }}
                />
            </Stack>
        </Card>
    );
};

export default function FeedbackListSkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 2, md: 2.5 },
                alignItems: "stretch",
                minWidth: 0,
            }}
        >
            {Array.from({ length: 6 }, (_, index) => (
                <FeedbackSkeletonCard key={index} index={index} />
            ))}
        </Box>
    );
}
