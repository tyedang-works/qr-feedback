import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

const GRID_COLUMNS = "1.5fr 1.5fr 1fr 180px";
const SKELETON_ROW_COUNT = 5;

const TABLE_HEADER_WIDTHS = [150, 100, 50, 65];

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
                    xs: "1px solid #EAECF0",
                    md: "none",
                },
                borderBottom: "1px solid #EAECF0",
                borderRadius: { xs: 2, md: 0 },
                bgcolor: "#FFFFFF",
                boxShadow: {
                    xs: "0 1px 2px rgba(16, 24, 40, 0.03)",
                    md: "none",
                },
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                }}
            >
                <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ flexShrink: 0 }}
                />

                <Stack sx={{ flex: 1, minWidth: 0, gap: 0.5 }}>
                    <Skeleton
                        variant="text"
                        sx={{ width: 120, maxWidth: "85%", height: 22 }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            display: { xs: "block", md: "none" },
                            width: "75%",
                            height: 20,
                        }}
                    />
                </Stack>
            </Stack>

            <Skeleton
                variant="text"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: "75%",
                    height: 22,
                }}
            />

            <Skeleton
                variant="text"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: 55,
                    height: 26,
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
                        width: 55,
                        height: 22,
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
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
                    justifyContent: "space-between",
                    gap: 2,
                    pt: 1.5,
                    borderTop: "1px solid #EAECF0",
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: 55,
                        height: 24,
                        borderRadius: 1,
                    }}
                />

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            width: 55,
                            height: 22,
                            transform: "none",
                        }}
                    />

                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            width: 30,
                            height: 22,
                            transform: "none",
                        }}
                    />
                </Stack>
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
                border: "1px solid #EAECF0",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
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
                    bgcolor: "#F9FAFB",
                    borderBottom: "1px solid #EAECF0",
                }}
            >
                {TABLE_HEADER_WIDTHS.map((width, index) => (
                    <Skeleton
                        key={index}
                        variant="text"
                        sx={{ width, height: 22 }}
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
                    sx={{
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
