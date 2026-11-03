import { Box, Skeleton, Stack } from "@mui/material";

const TABLE_COLUMNS =
    "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px";

const skeletonColor =
    "var(--color-table-skeleton, var(--color-donut-skeleton))";

export default function TablesDesktopSkeleton() {
    return (
        <Box
            sx={{
                display: {
                    xs: "none",
                    sm: "block",
                },
                minWidth: 0,
            }}
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <Box key={index}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: TABLE_COLUMNS,
                            alignItems: "center",
                            gap: 2,
                            px: 2.5,
                            py: 1.75,
                            minHeight: 68,
                        }}
                    >
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{
                                width: 76,
                                maxWidth: "100%",
                                height: 22,
                                bgcolor: skeletonColor,
                            }}
                        />

                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{
                                width: "85%",
                                maxWidth: 240,
                                height: 22,
                                bgcolor: skeletonColor,
                            }}
                        />

                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    width: 36,
                                    height: 20,
                                    borderRadius: 999,
                                    bgcolor: skeletonColor,
                                }}
                            />

                            <Skeleton
                                variant="text"
                                animation="wave"
                                sx={{
                                    width: 55,
                                    height: 20,
                                    bgcolor: skeletonColor,
                                }}
                            />
                        </Stack>

                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
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
                                    width: 42,
                                    height: 22,
                                    bgcolor: skeletonColor,
                                }}
                            />
                        </Stack>
                    </Box>

                    {index < 5 && (
                        <Box
                            sx={{
                                borderTop: "1px solid var(--color-border)",
                            }}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
}
