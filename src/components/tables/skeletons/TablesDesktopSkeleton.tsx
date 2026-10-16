import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const TABLE_COLUMNS =
    "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px";

export default function TablesDesktopSkeleton() {
    const headers = [34, 95, 145, 60];

    return (
        <Box
            sx={{
                display: { xs: "none", sm: "block" },
                width: "100%",
                overflowX: "auto",
            }}
        >
            <Card sx={{ ...cardSx, minWidth: 620 }}>
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
            </Card>
        </Box>
    );
}
