import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-skeleton, rgba(145, 158, 171, 0.16))",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-skeleton-highlight, rgba(255, 255, 255, 0.12)), transparent)",
    },
};

const dividerSx = {
    borderColor: "var(--color-border, #E5E7EB)",
};

function Placeholder({
    width,
    height,
    variant = "text",
}: {
    width?: number | string;
    height: number;
    variant?: "text" | "rounded" | "circular";
}) {
    return (
        <Skeleton
            variant={variant}
            width={width}
            height={height}
            animation="wave"
            sx={{
                ...skeletonSx,
                ...(variant === "text" && { transform: "none" }),
                ...(variant === "rounded" && { borderRadius: 1.5 }),
            }}
        />
    );
}

export default function FeedbackDetailSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                p: 0,
                overflow: "hidden",
                boxShadow: "none",
            }}
        >
            <Stack sx={{ px: { xs: 2, md: 2.5 }, pt: 2.5, pb: 2, gap: 1.5 }}>
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Placeholder width={145} height={23} />
                        <Box sx={{ mt: 0.25 }}>
                            <Placeholder width={165} height={19} />
                        </Box>
                    </Box>

                    <Placeholder width={86} height={26} variant="rounded" />
                </Stack>

                <Box sx={{ pt: 1.5, borderTop: "1px solid", ...dividerSx }}>
                    <Stack
                        sx={{
                            flexDirection: "row",
                            columnGap: 5,
                            rowGap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box>
                            <Placeholder width={30} height={18} />
                            <Box sx={{ mt: 0.5 }}>
                                <Placeholder width={65} height={22} />
                            </Box>
                        </Box>

                        <Box>
                            <Placeholder width={85} height={18} />
                            <Box sx={{ mt: 0.5 }}>
                                <Placeholder width={125} height={22} />
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Stack>

            <Box sx={{ borderTop: "1px solid", ...dividerSx }} />

            <Stack
                sx={{
                    px: { xs: 2, md: 2.5 },
                    py: 2,
                    gap: 2,
                }}
            >
                <Box>
                    <Placeholder width={195} height={22} />

                    <Stack
                        sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 0.75,
                            mt: 1,
                        }}
                    >
                        {[135, 108].map((width) => (
                            <Placeholder
                                key={width}
                                width={width}
                                height={27}
                                variant="rounded"
                            />
                        ))}
                    </Stack>
                </Box>

                <Box>
                    <Placeholder width={125} height={22} />
                    <Box sx={{ mt: 0.75 }}>
                        <Placeholder
                            width="100%"
                            height={54}
                            variant="rounded"
                        />
                    </Box>
                </Box>

                <Box>
                    <Placeholder width={175} height={22} />

                    <Box sx={{ mt: 0.5 }}>
                        <Placeholder width={115} height={20} />
                    </Box>
                </Box>
            </Stack>

            <Box sx={{ borderTop: "1px solid", ...dividerSx }} />

            <Stack
                sx={{
                    px: { xs: 2, md: 2.5 },
                    pt: 2,
                    pb: 2.5,
                    gap: 1.5,
                }}
            >
                <Box>
                    <Placeholder width={145} height={22} />

                    <Box sx={{ mt: 0.25 }}>
                        <Placeholder width={245} height={19} />
                    </Box>
                </Box>

                <Stack sx={{ gap: 2 }}>
                    <Box>
                        <Placeholder width={105} height={18} />

                        <Box sx={{ mt: 0.5 }}>
                            <Placeholder
                                width="100%"
                                height={42}
                                variant="rounded"
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Placeholder width={115} height={18} />

                        <Box sx={{ mt: 0.5 }}>
                            <Placeholder
                                width="100%"
                                height={100}
                                variant="rounded"
                            />
                        </Box>
                    </Box>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Placeholder
                            width={130}
                            height={40}
                            variant="rounded"
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
}
