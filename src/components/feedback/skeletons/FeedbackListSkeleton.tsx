import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

export default function FeedbackListSkeleton() {
    return (
        <Card sx={{ ...cardSx, overflow: "hidden" }}>
            <Box
                sx={{
                    px: 2,
                    py: 1.75,
                    borderBottom: "1px solid #EAECF0",
                }}
            >
                <Skeleton
                    variant="text"
                    width={150}
                    height={22}
                    sx={{ transform: "none" }}
                />
                <Skeleton
                    variant="text"
                    width={200}
                    height={19}
                    sx={{ mt: 0.25, transform: "none" }}
                />
            </Box>

            {[1, 2, 3, 4].map((item) => (
                <Box
                    key={item}
                    sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom: item < 4 ? "1px solid #EAECF0" : "none",
                        backgroundColor: item === 1 ? "#F0F6FA" : "#FFFFFF",
                        borderLeft:
                            item === 1
                                ? "3px solid #193B56"
                                : "3px solid transparent",
                    }}
                >
                    <Stack sx={{ gap: 1 }}>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Skeleton
                                    variant="text"
                                    width={70}
                                    height={21}
                                    sx={{ transform: "none" }}
                                />
                            </Box>

                            <Skeleton
                                variant="text"
                                width={90}
                                height={18}
                                sx={{ transform: "none" }}
                            />
                        </Stack>

                        <Stack
                            sx={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 0.75,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                width={item === 2 ? 88 : 42}
                                height={22}
                                sx={{ borderRadius: 1 }}
                            />
                            <Skeleton
                                variant="rounded"
                                width={125}
                                height={22}
                                sx={{ borderRadius: 1 }}
                            />
                            <Skeleton
                                variant="rounded"
                                width={100}
                                height={22}
                                sx={{ borderRadius: 1 }}
                            />
                        </Stack>

                        <Skeleton
                            variant="text"
                            width={item === 2 ? "75%" : "45%"}
                            height={20}
                            sx={{ transform: "none" }}
                        />

                        <Skeleton
                            variant="text"
                            width={135}
                            height={19}
                            sx={{ transform: "none" }}
                        />
                    </Stack>
                </Box>
            ))}
        </Card>
    );
}
