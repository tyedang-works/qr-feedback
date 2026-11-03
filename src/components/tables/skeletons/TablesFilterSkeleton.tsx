import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";
import type { ReactNode } from "react";

type TablesFilterSkeletonProps = {
    children: ReactNode;
};

const TABLE_COLUMNS =
    "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px";

export default function TablesFilterSkeleton({
    children,
}: TablesFilterSkeletonProps) {
    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                p: 0,
                mt: 2,
                position: "sticky",
                top: {
                    xs: "80px",
                    md: "90px",
                },
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                minHeight: 0,
                height: {
                    xs: "calc(100dvh - 96px)",
                    md: "calc(100dvh - 106px)",
                },
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    flexShrink: 0,
                    px: { xs: 2, sm: 2.5 },
                    pt: { xs: 2, sm: 2.5 },
                    pb: 2,
                    bgcolor: "var(--color-surface)",
                    borderRadius: "16px 16px 0 0",
                }}
            >
                <Stack
                    sx={{
                        width: "100%",
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                        alignItems: "stretch",
                        gap: 1.5,
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                            display: "block",
                            width: {
                                xs: "100%",
                                md: "auto",
                            },
                            height: 42,
                            flex: {
                                xs: "0 0 42px",
                                md: 1,
                            },
                            minWidth: 0,
                            borderRadius: 1.5,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                            display: "block",
                            width: {
                                xs: "100%",
                                md: 230,
                            },
                            height: 42,
                            flexShrink: 0,
                            borderRadius: 1.5,
                        }}
                    />
                </Stack>

                <Stack
                    sx={{
                        mt: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        gap: 1.25,
                    }}
                >
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width={125}
                        height={20}
                        sx={{
                            transform: "none",
                        }}
                    />
                </Stack>
            </Box>

            <Box
                sx={{
                    display: {
                        xs: "none",
                        sm: "grid",
                    },
                    gridTemplateColumns: TABLE_COLUMNS,
                    alignItems: "center",
                    gap: 2,
                    px: 2.5,
                    py: 1.5,
                    minHeight: 52,
                    flexShrink: 0,
                    bgcolor: "var(--color-table-header-bg)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                {[55, 100, 115, 55].map((width, index) => (
                    <Stack
                        key={index}
                        sx={{
                            alignItems: index === 3 ? "center" : "flex-start",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width={width}
                            height={22}
                            sx={{
                                transform: "none",
                                maxWidth: "100%",
                                bgcolor: "var(--color-table-header-skeleton)",
                            }}
                        />
                    </Stack>
                ))}
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    minWidth: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    overscrollBehaviorY: "contain",
                    WebkitOverflowScrolling: "touch",
                    scrollbarGutter: "stable",
                }}
            >
                {children}
            </Box>
        </Card>
    );
}
