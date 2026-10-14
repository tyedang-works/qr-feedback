import { Box, Card, Skeleton, Stack } from "@mui/material";

const BAR_WIDTHS = ["76%", "52%", "26%", "26%", "26%"];

const LABEL_WIDTHS = [92, 88, 92, 100, 90];

export default function IssueDistributionSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px solid var(--color-border, #F0F2F5)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
                minWidth: 0,
                height: "fit-content",
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        md: "flex-start",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton
                        variant="text"
                        width={125}
                        height={24}
                        sx={{ transform: "none" }}
                    />

                    <Skeleton
                        variant="text"
                        width={245}
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
                        gap: 1,
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        width={65}
                        height={32}
                        sx={{ borderRadius: "7px" }}
                    />

                    <Skeleton
                        variant="rounded"
                        width={91}
                        height={32}
                        sx={{ borderRadius: "7px" }}
                    />
                </Stack>
            </Stack>

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2.5,
                    mt: 2.5,
                    mb: 1,
                }}
            >
                {[1, 2].map((item) => (
                    <Stack
                        key={item}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.75,
                        }}
                    >
                        <Skeleton variant="circular" width={9} height={9} />

                        <Skeleton
                            variant="text"
                            width={item === 1 ? 105 : 100}
                            height={20}
                            sx={{ transform: "none" }}
                        />
                    </Stack>
                ))}
            </Stack>

            <Box
                sx={{
                    mt: 1,
                    width: "100%",
                    height: {
                        xs: 290,
                        sm: 310,
                    },
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    <Stack
                        sx={{
                            width: { xs: 112, sm: 155 },
                            flexShrink: 0,
                            justifyContent: "space-around",
                            alignItems: "flex-end",
                            pr: 1.5,
                            py: 0.5,
                        }}
                    >
                        {LABEL_WIDTHS.map((width, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    width: "100%",
                                    alignItems: "flex-end",
                                    gap: 0,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    width={width}
                                    height={14}
                                    sx={{ transform: "none" }}
                                />

                                {index === 1 ||
                                index === 2 ||
                                index === 3 ||
                                index === 4 ? (
                                    <Skeleton
                                        variant="text"
                                        width={index === 1 ? 54 : 48}
                                        height={14}
                                        sx={{ transform: "none" }}
                                    />
                                ) : null}
                            </Stack>
                        ))}
                    </Stack>

                    <Box
                        sx={{
                            position: "relative",
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            py: 0.5,
                            backgroundImage:
                                "repeating-linear-gradient(to right, transparent 0, transparent calc(25% - 1px), #EAECF0 calc(25% - 1px), #EAECF0 25%)",
                            backgroundSize: "100% 100%",
                        }}
                    >
                        {BAR_WIDTHS.map((width, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    gap: "4px",
                                    justifyContent: "center",
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    width={width}
                                    height={12}
                                    sx={{
                                        borderRadius: "0 4px 4px 0",
                                    }}
                                />

                                {index === 0 && (
                                    <Skeleton
                                        variant="rounded"
                                        width="25%"
                                        height={12}
                                        sx={{
                                            borderRadius: "0 4px 4px 0",
                                        }}
                                    />
                                )}
                            </Stack>
                        ))}
                    </Box>
                </Box>

                <Stack
                    sx={{
                        ml: { xs: "112px", sm: "155px" },
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1,
                        pr: 0.5,
                    }}
                >
                    {[0, 1, 2, 3, 4].map((tick) => (
                        <Skeleton
                            key={tick}
                            variant="text"
                            width={8}
                            height={18}
                            sx={{ transform: "none" }}
                        />
                    ))}
                </Stack>
            </Box>
        </Card>
    );
}
