import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

function QRCodeFilterSkeleton() {
    const fields = [
        { labelWidth: 76 },
        { labelWidth: 54 },
        { labelWidth: 76 },
        { labelWidth: 48 },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1.8fr 1fr",
                    lg: "2fr 1.1fr 1.2fr 0.8fr",
                },
                gap: 1.5,
                p: 2,
                border: "1px solid #eaecf0",
                borderRadius: 2,
                backgroundColor: "#ffffff",
            }}
        >
            {fields.map((field, index) => (
                <Stack key={index} sx={{ gap: 0.5, minWidth: 0 }}>
                    <Skeleton
                        variant="text"
                        sx={{
                            width: field.labelWidth,
                            height: 20,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: "100%",
                            height: 40,
                            borderRadius: 1,
                        }}
                    />
                </Stack>
            ))}
        </Box>
    );
}

function QRCodeDesktopTableSkeleton() {
    const columns = "48px 1.5fr 1.5fr 1fr 120px";

    return (
        <Box
            sx={{
                display: { xs: "none", md: "block" },
                width: "100%",
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid #eaecf0",
                borderRadius: 2,
                backgroundColor: "#ffffff",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: columns,
                    alignItems: "center",
                    minHeight: 48,
                    px: 3,
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #eaecf0",
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "4px",
                    }}
                />

                <Skeleton variant="text" sx={{ width: 36, height: 22 }} />

                <Skeleton variant="text" sx={{ width: 52, height: 22 }} />

                <Skeleton variant="text" sx={{ width: 100, height: 22 }} />

                <Stack sx={{ alignItems: "flex-end" }}>
                    <Skeleton variant="text" sx={{ width: 60, height: 22 }} />
                </Stack>
            </Box>
            {Array.from({ length: 7 }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: columns,
                        alignItems: "center",
                        minHeight: 67,
                        px: 3,
                        borderBottom:
                            index === 6 ? "none" : "1px solid #eaecf0",
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "4px",
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: "45%",
                            maxWidth: 100,
                            height: 22,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: "75%",
                            maxWidth: 280,
                            height: 22,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: 100,
                            maxWidth: "90%",
                            height: 24,
                            borderRadius: 999,
                        }}
                    />

                    <Stack sx={{ alignItems: "flex-end" }}>
                        <Skeleton
                            variant="text"
                            sx={{
                                width: 52,
                                height: 22,
                            }}
                        />
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}

function QRCodeMobileListSkeleton() {
    return (
        <Stack
            sx={{
                display: { xs: "flex", md: "none" },
                gap: 1.5,
                width: "100%",
            }}
        >
            {Array.from({ length: 4 }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        p: 2,
                        border: "1px solid #eaecf0",
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Stack sx={{ gap: 1.5 }}>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 1,
                                    minWidth: 0,
                                    flex: 1,
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    sx={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: "4px",
                                        flexShrink: 0,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    sx={{
                                        width: 100,
                                        maxWidth: "100%",
                                        height: 22,
                                    }}
                                />
                            </Stack>

                            <Skeleton
                                variant="rounded"
                                sx={{
                                    width: 88,
                                    height: 24,
                                    borderRadius: 999,
                                    flexShrink: 0,
                                }}
                            />
                        </Stack>

                        <Box
                            sx={{
                                pt: 1,
                                borderTop: "1px solid #eaecf0",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                sx={{
                                    width: 44,
                                    height: 18,
                                }}
                            />

                            <Skeleton
                                variant="text"
                                sx={{
                                    width: "85%",
                                    height: 22,
                                }}
                            />
                        </Box>

                        <Skeleton
                            variant="rounded"
                            sx={{
                                width: "100%",
                                height: 36,
                                borderRadius: 1,
                            }}
                        />
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}

function QRCodePaginationSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 1.5,
                py: 1,
            }}
        >
            <Skeleton
                variant="text"
                sx={{
                    width: 150,
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
                        width: 34,
                        height: 34,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1,
                    }}
                />
            </Stack>
        </Stack>
    );
}

export default function QRCodesLoading() {
    return (
        <PageLoadingSkeleton titleWidth={150} subtitleWidth={320} gap={2}>
            <QRCodeFilterSkeleton />

            <Stack sx={{ gap: 2, width: "100%", minWidth: 0 }}>
                <QRCodeDesktopTableSkeleton />
                <QRCodeMobileListSkeleton />
                <QRCodePaginationSkeleton />
            </Stack>
        </PageLoadingSkeleton>
    );
}
