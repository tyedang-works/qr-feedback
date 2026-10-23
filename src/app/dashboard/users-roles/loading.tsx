import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

const GRID_COLUMNS = "1.5fr 1.5fr 1fr 180px";
const SKELETON_ROW_COUNT = 5;

const TABLE_HEADER_WIDTHS = [150, 100, 50, 65];

const skeletonSx = {
    bgcolor: "var(--color-skeleton)",
};

function UserRowSkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: GRID_COLUMNS,
                },
                alignItems: "center",
                gap: { xs: 1.5, md: 0 },
                minHeight: { xs: "auto", md: 64 },
                p: { xs: 2, md: 0 },
                px: { md: 3 },
                border: {
                    xs: "1px solid var(--color-border)",
                    md: "none",
                },
                borderBottom: "1px solid var(--color-border)",
                borderRadius: { xs: 2, md: 0 },
                bgcolor: "var(--color-surface)",
                boxShadow: {
                    xs: "var(--shadow-card)",
                    md: "none",
                },
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: { xs: "flex-start", md: "center" },
                    gap: 1.5,
                    minWidth: 0,
                }}
            >
                <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{
                        ...skeletonSx,
                        flexShrink: 0,
                        display: { xs: "none", md: "block" },
                    }}
                />

                <Stack sx={{ flex: 1, minWidth: 0, gap: 0.5 }}>
                    <Skeleton
                        variant="text"
                        sx={{
                            ...skeletonSx,
                            width: 120,
                            maxWidth: "85%",
                            height: 22,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            ...skeletonSx,
                            display: { xs: "block", md: "none" },
                            width: "75%",
                            height: 20,
                        }}
                    />
                </Stack>

                <Skeleton
                    variant="rounded"
                    sx={{
                        ...skeletonSx,
                        display: { xs: "block", md: "none" },
                        width: 48,
                        height: 26,
                        borderRadius: 1.5,
                        flexShrink: 0,
                    }}
                />
            </Stack>

            <Skeleton
                variant="text"
                sx={{
                    ...skeletonSx,
                    display: { xs: "none", md: "block" },
                    width: "75%",
                    height: 22,
                }}
            />

            <Skeleton
                variant="rounded"
                sx={{
                    ...skeletonSx,
                    display: { xs: "none", md: "block" },
                    width: 55,
                    height: 26,
                    borderRadius: 1.5,
                }}
            />

            <Stack
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 55,
                        height: 22,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 48,
                        height: 22,
                        transform: "none",
                    }}
                />
            </Stack>

            <Stack
                sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    pt: 1.5,
                    borderTop: "1px solid var(--color-border)",
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 55,
                        height: 22,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: 30,
                        height: 22,
                        transform: "none",
                    }}
                />
            </Stack>
        </Box>
    );
}

function DesktopTableSkeleton() {
    return (
        <Box
            sx={{
                display: { xs: "none", md: "block" },
                width: "100%",
                minWidth: 0,
                border: "1px solid var(--color-border)",
                borderRadius: 2,
                bgcolor: "var(--color-surface)",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: GRID_COLUMNS,
                    alignItems: "center",
                    minHeight: 52,
                    px: 3,
                    bgcolor: "var(--color-table-header-bg)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                {TABLE_HEADER_WIDTHS.map((width, index) => (
                    <Skeleton
                        key={index}
                        variant="text"
                        sx={{
                            ...skeletonSx,
                            width,
                            height: 22,
                        }}
                    />
                ))}
            </Box>

            {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <UserRowSkeleton key={index} />
            ))}
        </Box>
    );
}

function MobileUserCardsSkeleton() {
    return (
        <Stack
            sx={{
                display: { xs: "flex", md: "none" },
                gap: 1.5,
                minWidth: 0,
            }}
        >
            {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <UserRowSkeleton key={index} />
            ))}
        </Stack>
    );
}

export default function UsersRolesLoading() {
    return (
        <PageLoadingSkeleton
            titleWidth={190}
            subtitleWidth={340}
            gap={3}
            action={
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                        ...skeletonSx,
                        width: { xs: "100%", sm: 169 },
                        height: 40,
                        borderRadius: 1.5,
                        flexShrink: 0,
                    }}
                />
            }
        >
            <DesktopTableSkeleton />
            <MobileUserCardsSkeleton />
        </PageLoadingSkeleton>
    );
}
