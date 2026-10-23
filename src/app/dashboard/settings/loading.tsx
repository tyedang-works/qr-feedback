import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

const skeletonSx = {
    bgcolor: "var(--color-skeleton)",
};

function SettingsTabsSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                px: { xs: 2, sm: 3.5 },
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <Stack
                sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    minHeight: 64,
                    px: 1.5,
                    borderBottom: "2px solid var(--color-tab-indicator)",
                }}
            >
                <Skeleton
                    variant="text"
                    sx={{ ...skeletonSx, width: 105, height: 20 }}
                />
            </Stack>

            <Stack
                sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 64,
                    px: 1.5,
                }}
            >
                <Skeleton
                    variant="text"
                    sx={{ ...skeletonSx, width: 135, height: 20 }}
                />
            </Stack>
        </Stack>
    );
}

function RestaurantBrandSkeleton() {
    return (
        <Stack
            sx={{
                alignItems: "center",
                textAlign: "center",
                gap: 1,
                minWidth: 0,
                width: "100%",
            }}
        >
            <Skeleton
                variant="circular"
                sx={{
                    ...skeletonSx,
                    width: 200,
                    height: 200,
                    maxWidth: "100%",
                    flexShrink: 0,
                }}
            />

            <Stack
                sx={{
                    alignItems: "center",
                    gap: 0.5,
                    width: "100%",
                }}
            >
                <Skeleton
                    variant="text"
                    sx={{
                        ...skeletonSx,
                        width: 160,
                        height: 26,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        ...skeletonSx,
                        width: 100,
                        height: 18,
                    }}
                />
            </Stack>

            <Stack
                sx={{
                    alignItems: "center",
                    gap: 0.5,
                    mt: 1,
                    width: "100%",
                }}
            >
                <Skeleton
                    variant="text"
                    sx={{
                        ...skeletonSx,
                        width: "85%",
                        maxWidth: 230,
                        height: 18,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        ...skeletonSx,
                        width: "70%",
                        maxWidth: 190,
                        height: 18,
                    }}
                />
            </Stack>
        </Stack>
    );
}

function SettingsFieldSkeleton({ labelWidth }: { labelWidth: number }) {
    return (
        <Stack sx={{ gap: 0.75, minWidth: 0 }}>
            <Skeleton
                variant="text"
                sx={{
                    ...skeletonSx,
                    width: labelWidth,
                    height: 20,
                }}
            />

            <Skeleton
                variant="rounded"
                sx={{
                    ...skeletonSx,
                    width: "100%",
                    height: 42,
                    borderRadius: 1,
                }}
            />
        </Stack>
    );
}

function RestaurantFormSkeleton() {
    return (
        <Stack sx={{ gap: 2.5, minWidth: 0 }}>
            <Stack sx={{ gap: 0.5 }}>
                <Skeleton
                    variant="text"
                    sx={{
                        ...skeletonSx,
                        width: 155,
                        height: 24,
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        ...skeletonSx,
                        width: "75%",
                        maxWidth: 360,
                        height: 18,
                    }}
                />
            </Stack>

            <SettingsFieldSkeleton labelWidth={100} />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                    minWidth: 0,
                }}
            >
                <SettingsFieldSkeleton labelWidth={90} />
                <SettingsFieldSkeleton labelWidth={45} />
            </Box>

            <SettingsFieldSkeleton labelWidth={55} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    pt: 1,
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        ...skeletonSx,
                        width: { xs: "100%", sm: 140 },
                        height: 40,
                        borderRadius: 1.5,
                    }}
                />
            </Box>
        </Stack>
    );
}

function SettingsSectionSkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "minmax(0, 0.55fr) minmax(0, 1.45fr)",
                },
                gap: { xs: 3, md: 4 },
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    minWidth: 0,
                    pb: { xs: 2, md: 0 },
                    borderBottom: {
                        xs: "1px solid var(--color-border)",
                        md: "none",
                    },
                    borderRight: {
                        xs: "none",
                        md: "1px dashed var(--color-border)",
                    },
                    pr: { md: 4 },
                }}
            >
                <RestaurantBrandSkeleton />
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <RestaurantFormSkeleton />
            </Box>
        </Box>
    );
}

export default function SettingsLoading() {
    return (
        <PageLoadingSkeleton titleWidth={260} subtitleWidth={340} gap={3}>
            <Box
                sx={{
                    width: "100%",
                    border: "1px solid var(--color-border)",
                    borderRadius: 3,
                    bgcolor: "var(--color-surface)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-card)",
                }}
            >
                <SettingsTabsSkeleton />

                <Stack
                    sx={{
                        gap: 3,
                        px: { xs: 2.5, sm: 3.5 },
                        py: { xs: 3, sm: 3.5 },
                    }}
                >
                    <SettingsSectionSkeleton />
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: { xs: 2.5, sm: 3.5 },
                        py: 2,
                        borderTop: "1px solid var(--color-border)",
                        bgcolor: "var(--color-surface-hover)",
                    }}
                >
                    <Skeleton
                        variant="circular"
                        sx={{
                            ...skeletonSx,
                            width: 14,
                            height: 14,
                            flexShrink: 0,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            ...skeletonSx,
                            width: { xs: "85%", sm: 350 },
                            height: 18,
                        }}
                    />
                </Box>
            </Box>
        </PageLoadingSkeleton>
    );
}
