import { Box, Card, Skeleton, Stack } from "@mui/material";

const CHART_BAR_HEIGHTS = [0, 100, 0, 26, 0, 0, 0];

export default function FeedbackTrendSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                minWidth: 0,
                height: "100%",
                boxSizing: "border-box",
                border: "1px solid var(--color-border, #F0F2F5)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    gap: 2,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "stretch",
                            sm: "flex-start",
                        },
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Skeleton
                            variant="text"
                            width={145}
                            height={24}
                            sx={{ transform: "none" }}
                        />

                        <Skeleton
                            variant="text"
                            width={250}
                            height={21}
                            sx={{
                                mt: 0.5,
                                transform: "none",
                            }}
                        />
                    </Box>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.75,
                            flexShrink: 0,
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={76}
                            height={30}
                            sx={{ borderRadius: "7px" }}
                        />

                        <Skeleton
                            variant="rounded"
                            width={76}
                            height={30}
                            sx={{ borderRadius: "7px" }}
                        />
                    </Stack>
                </Stack>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: { xs: 3, sm: 4 },
                    }}
                >
                    {[1, 2].map((item) => (
                        <Box key={item}>
                            <Skeleton
                                variant="text"
                                width={item === 1 ? 145 : 125}
                                height={19}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={item === 1 ? 35 : 45}
                                height={32}
                                sx={{
                                    mt: 0.5,
                                    transform: "none",
                                }}
                            />
                        </Box>
                    ))}
                </Stack>

                <Box
                    sx={{
                        mt: 0.5,
                        width: "100%",
                        height: { xs: 240, sm: 290 },
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            flex: 1,
                            minHeight: 0,
                            display: "flex",
                        }}
                    >
                        <Stack
                            sx={{
                                width: 20,
                                flexShrink: 0,
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                py: 0.5,
                            }}
                        >
                            {[4, 3, 2, 1, 0].map((tick) => (
                                <Skeleton
                                    key={tick}
                                    variant="text"
                                    width={8}
                                    height={14}
                                    sx={{ transform: "none" }}
                                />
                            ))}
                        </Stack>

                        <Box
                            sx={{
                                position: "relative",
                                flex: 1,
                                minWidth: 0,
                                ml: 0.5,
                            }}
                        >
                            <Stack
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    justifyContent: "space-between",
                                }}
                            >
                                {[0, 1, 2, 3, 4].map((line) => (
                                    <Box
                                        key={line}
                                        sx={{
                                            width: "100%",
                                            borderTop: "1px dashed #EAECF0",
                                        }}
                                    />
                                ))}
                            </Stack>

                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: "0 0 0 0",
                                    display: "flex",
                                    alignItems: "stretch",
                                    justifyContent: "space-around",
                                    px: { xs: 1, sm: 2 },
                                }}
                            >
                                {CHART_BAR_HEIGHTS.map((height, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            maxWidth: 32,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        {height > 0 && (
                                            <Skeleton
                                                variant="rounded"
                                                width="100%"
                                                height={`${height}%`}
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    borderRadius: "5px 5px 0 0",
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            ml: "24px",
                            pt: 1,
                        }}
                    >
                        {Array.from({ length: 7 }, (_, index) => (
                            <Skeleton
                                key={index}
                                variant="text"
                                width={30}
                                height={17}
                                sx={{ transform: "none" }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Card>
    );
}
