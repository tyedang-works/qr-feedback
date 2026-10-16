import { Box, Skeleton, Stack } from "@mui/material";

export default function TablesMobileSkeleton() {
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
