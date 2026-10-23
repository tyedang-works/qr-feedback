import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

const skeletonSx = {
    bgcolor: "var(--color-surface-active)",
};

const skeletonBorderSx = {
    border: "1px solid var(--color-border)",
    borderRadius: 2,
    backgroundColor: "var(--color-surface)",
};

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
                ...skeletonBorderSx,
            }}
        >
            {fields.map((field, index) => (
                <Stack key={index} sx={{ gap: 0.5, minWidth: 0 }}>
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: field.labelWidth,
                            height: 20,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
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
                ...skeletonBorderSx,
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: columns,
                    alignItems: "center",
                    minHeight: 56,
                    px: 3,
                    backgroundColor: "var(--color-table-header-bg)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 18,
                        height: 18,
                        borderRadius: "4px",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 36,
                        height: 22,
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 52,
                        height: 22,
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 100,
                        height: 22,
                    }}
                />

                <Stack sx={{ alignItems: "flex-end" }}>
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: 60,
                            height: 22,
                        }}
                    />
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
                            index === 6
                                ? "none"
                                : "1px solid var(--color-border)",
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: 18,
                            height: 18,
                            borderRadius: "4px",
                        }}
                    />

                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: "45%",
                            maxWidth: 100,
                            height: 22,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: "75%",
                            maxWidth: 280,
                            height: 22,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: 100,
                            maxWidth: "90%",
                            height: 24,
                            borderRadius: 999,
                        }}
                    />

                    <Stack sx={{ alignItems: "flex-end" }}>
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{
                                ...skeletonSx,
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
                        ...skeletonBorderSx,
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
                                    animation="wave"
                                    sx={{
                                        ...skeletonSx,
                                        width: 18,
                                        height: 18,
                                        borderRadius: "4px",
                                        flexShrink: 0,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    sx={{
                                        ...skeletonSx,
                                        width: 100,
                                        maxWidth: "100%",
                                        height: 22,
                                    }}
                                />
                            </Stack>

                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
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
                                borderTop: "1px solid var(--color-border)",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    width: 44,
                                    height: 18,
                                }}
                            />

                            <Skeleton
                                variant="text"
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    width: "100%",
                                    height: 22,
                                }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    ...skeletonSx,
                                    width: "100px",
                                    height: 36,
                                    borderRadius: 1,
                                }}
                            />
                        </Box>
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                py: { xs: 1, md: 0 },
            }}
        >
            <Skeleton
                variant="text"
                animation="wave"
                sx={{
                    ...skeletonSx,
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
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        animation="wave"
                        sx={{
                            ...skeletonSx,
                            width: 34,
                            height: 34,
                            borderRadius: 1,
                        }}
                    />
                ))}
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
