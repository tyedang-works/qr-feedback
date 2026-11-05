import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

const STATUS_TAB_WIDTHS = [90, 112, 112, 120];

export default function FeedbackToolbarSkeleton() {
    return (
        <Card elevation={0} sx={cardSx}>
            <Stack
                direction="row"
                sx={{
                    gap: { xs: 2, sm: 3 },
                    alignItems: "center",
                    borderBottom: "1px solid var(--color-border)",
                    overflow: "hidden",
                }}
            >
                {STATUS_TAB_WIDTHS.map((width, index) => (
                    <Stack
                        key={index}
                        direction="row"
                        sx={{
                            height: 44,
                            flexShrink: 0,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.75,
                            px: 1,
                            borderBottom:
                                index === 0
                                    ? "3px solid var(--color-primary)"
                                    : "3px solid transparent",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width={width - 30}
                            height={20}
                            sx={{ transform: "none" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={26}
                            height={22}
                            sx={{ borderRadius: 1 }}
                        />
                    </Stack>
                ))}
            </Stack>

            <Stack
                direction={{ xs: "column", md: "row" }}
                sx={{
                    alignItems: "center",
                    gap: 1,
                    mt: 2.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: "100%",
                        flex: 1,
                        minWidth: 0,
                        height: 42,
                        borderRadius: 1,
                    }}
                />

                <Stack
                    direction="row"
                    sx={{
                        width: { xs: "100%", md: "auto" },
                        gap: 1,
                        flexShrink: 0,
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: { xs: 90, sm: 108 },
                            height: 42,
                            borderRadius: 1,
                            flexShrink: 0,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: { xs: 125, sm: 160 },
                            height: 42,
                            borderRadius: 1,
                            flexShrink: 0,
                        }}
                    />

                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: { xs: 100, sm: 132 },
                            height: 42,
                            borderRadius: 1,
                            flexShrink: 0,
                        }}
                    />
                </Stack>
            </Stack>

            <Box sx={{ mt: 1.5 }}>
                <Skeleton
                    variant="text"
                    width={105}
                    height={20}
                    sx={{ transform: "none" }}
                />
            </Box>
        </Card>
    );
}
