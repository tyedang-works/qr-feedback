import { Box, Skeleton, Stack } from "@mui/material";

const skeletonColor =
    "var(--color-table-skeleton, var(--color-donut-skeleton))";

function TableStatusSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                mt: 1.25,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: 36,
                    height: 20,
                    flexShrink: 0,
                    borderRadius: 999,
                    bgcolor: skeletonColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    px: "2px",
                }}
            >
                <Skeleton
                    variant="circular"
                    animation="wave"
                    sx={{
                        width: 16,
                        height: 16,
                        bgcolor: "var(--color-surface)",
                    }}
                />
            </Box>

            <Skeleton
                variant="text"
                animation="wave"
                sx={{
                    width: 88,
                    height: 20,
                    bgcolor: skeletonColor,
                }}
            />
        </Stack>
    );
}

export default function TablesMobileSkeleton() {
    return (
        <Stack
            sx={{
                display: {
                    xs: "flex",
                    sm: "none",
                },
                minWidth: 0,
            }}
        >
            {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index}>
                    <Box
                        sx={{
                            px: 2,
                            py: 2,
                        }}
                    >
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
                                    flex: 1,
                                    minWidth: 0,
                                    gap: 0.5,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    sx={{
                                        width: 100,
                                        maxWidth: "100%",
                                        height: 23,
                                        bgcolor: skeletonColor,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    sx={{
                                        width: "85%",
                                        maxWidth: 230,
                                        height: 20,
                                        bgcolor: skeletonColor,
                                    }}
                                />
                            </Stack>

                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 0.5,
                                    flexShrink: 0,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    sx={{
                                        width: 42,
                                        height: 22,
                                        bgcolor: skeletonColor,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    sx={{
                                        width: 32,
                                        height: 22,
                                        bgcolor: skeletonColor,
                                    }}
                                />
                            </Stack>
                        </Stack>

                        <TableStatusSkeleton />
                    </Box>

                    {index < 4 && (
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
