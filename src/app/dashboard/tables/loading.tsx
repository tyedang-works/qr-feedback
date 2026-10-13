import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

const TABLE_COLUMNS =
    "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px";

function TablesSummarySkeleton() {
    const items = [
        {
            key: "total",
            backgroundColor: "#f5f9fc",
            borderColor: "#e0eaf2",
            iconBackground: "#dceaf4",
        },
        {
            key: "active",
            backgroundColor: "#f3fcf6",
            borderColor: "#d9f0e1",
            iconBackground: "#d1fadf",
        },
        {
            key: "inactive",
            backgroundColor: "#fff9f3",
            borderColor: "#f5e7d8",
            iconBackground: "#ffead5",
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
                width: "100%",
            }}
        >
            {items.map((item) => (
                <Box
                    key={item.key}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        minWidth: 0,
                        px: { xs: 2, sm: 2.5 },
                        py: { xs: 2, sm: 2.5 },
                        border: `1px solid ${item.borderColor}`,
                        borderRadius: 2,
                        backgroundColor: item.backgroundColor,
                        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                >
                    <Stack sx={{ gap: 0.75, flex: 1 }}>
                        <Skeleton
                            variant="text"
                            sx={{
                                width: 105,
                                maxWidth: "100%",
                                height: 20,
                            }}
                        />

                        <Skeleton
                            variant="text"
                            sx={{
                                width: 48,
                                height: 36,
                                transform: "none",
                            }}
                        />
                    </Stack>

                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 2,
                            flexShrink: 0,
                            backgroundColor: item.iconBackground,
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
}

function TablesFilterSkeleton() {
    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 2, sm: 2.5 },
                border: "1px solid #eaecf0",
                borderRadius: 2,
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
            }}
        >
            <Stack
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "stretch",
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: "100%",
                        flex: 1,
                        minWidth: 0,
                        height: 40,
                        borderRadius: 1.5,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    sx={{
                        width: { xs: "100%", sm: 230 },
                        height: 40,
                        borderRadius: 1.5,
                        flexShrink: 0,
                    }}
                />
            </Stack>

            <Stack
                sx={{
                    mt: 1.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Skeleton variant="text" sx={{ width: 120, height: 20 }} />
            </Stack>
        </Box>
    );
}

function TablesDesktopSkeleton() {
    const headers = [34, 95, 145, 60];

    return (
        <Box
            sx={{
                display: { xs: "none", sm: "block" },
                width: "100%",
                overflowX: "auto",
            }}
        >
            <Box
                sx={{
                    minWidth: 620,
                    border: "1px solid #eaecf0",
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: TABLE_COLUMNS,
                        alignItems: "center",
                        gap: 2,
                        px: 2.5,
                        py: 1.5,
                        backgroundColor: "#f8fafc",
                    }}
                >
                    {headers.map((width, index) => (
                        <Stack
                            key={index}
                            sx={{
                                alignItems:
                                    index === 3 ? "center" : "flex-start",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                sx={{
                                    width,
                                    maxWidth: "100%",
                                    height: 22,
                                }}
                            />
                        </Stack>
                    ))}
                </Box>

                <Box sx={{ borderTop: "1px solid #eaecf0" }} />

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
                                minHeight: 60,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 76,
                                    maxWidth: "100%",
                                    height: 22,
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: "85%",
                                    maxWidth: 240,
                                    height: 22,
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
                                    sx={{
                                        width: 36,
                                        height: 20,
                                        borderRadius: 999,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 80,
                                        maxWidth: "100%",
                                        height: 20,
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
                                    sx={{ width: 48, height: 22 }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{ width: 28, height: 22 }}
                                />
                            </Stack>
                        </Box>

                        {index < 5 && (
                            <Box sx={{ borderTop: "1px solid #eaecf0" }} />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function TablesMobileSkeleton() {
    return (
        <Stack
            sx={{
                display: { xs: "flex", sm: "none" },
                border: "1px solid #eaecf0",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#ffffff",
            }}
        >
            {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index}>
                    <Box sx={{ px: 2, py: 2 }}>
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
                                    gap: 0.75,
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 100,
                                        maxWidth: "100%",
                                        height: 23,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: "85%",
                                        maxWidth: 230,
                                        height: 20,
                                    }}
                                />
                            </Stack>

                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    sx={{ width: 42, height: 22 }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{ width: 32, height: 22 }}
                                />
                            </Stack>
                        </Stack>

                        <Skeleton
                            variant="rounded"
                            sx={{
                                mt: 1.25,
                                width: 112,
                                height: 24,
                                borderRadius: 1,
                            }}
                        />
                    </Box>

                    {index < 4 && (
                        <Box sx={{ borderTop: "1px solid #eaecf0" }} />
                    )}
                </Box>
            ))}
        </Stack>
    );
}

export default function TablesLoading() {
    return (
        <PageLoadingSkeleton
            titleWidth={150}
            subtitleWidth={280}
            gap={2.5}
            action={
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: { xs: "100%", sm: 110 },
                        height: 40,
                        borderRadius: 1.5,
                        flexShrink: 0,
                    }}
                />
            }
        >
            <TablesSummarySkeleton />
            <TablesFilterSkeleton />
            <TablesDesktopSkeleton />
            <TablesMobileSkeleton />
        </PageLoadingSkeleton>
    );
}
