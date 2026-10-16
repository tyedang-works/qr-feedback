import { cardSx } from "@/styles/card.styles";
import { Box, Card, Skeleton, Stack } from "@mui/material";

export default function FeedbackDetailSkeleton() {
    return (
        <Card sx={{ ...cardSx, overflow: "hidden" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                            variant="text"
                            width={145}
                            height={23}
                            sx={{ transform: "none" }}
                        />
                        <Skeleton
                            variant="text"
                            width={165}
                            height={19}
                            sx={{ mt: 0.25, transform: "none" }}
                        />
                    </Box>

                    <Skeleton
                        variant="rounded"
                        width={86}
                        height={26}
                        sx={{
                            flexShrink: 0,
                            borderRadius: 1,
                        }}
                    />
                </Stack>

                <Box
                    sx={{
                        mt: 1.5,
                        pt: 1.5,
                        borderTop: "1px solid #EAECF0",
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            gap: 3,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box>
                            <Skeleton
                                variant="text"
                                width={30}
                                height={18}
                                sx={{ transform: "none" }}
                            />
                            <Skeleton
                                variant="text"
                                width={65}
                                height={22}
                                sx={{ transform: "none" }}
                            />
                        </Box>

                        <Box>
                            <Skeleton
                                variant="text"
                                width={85}
                                height={18}
                                sx={{ transform: "none" }}
                            />
                            <Skeleton
                                variant="text"
                                width={125}
                                height={22}
                                sx={{ transform: "none" }}
                            />
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
                <Skeleton
                    variant="text"
                    width={195}
                    height={22}
                    sx={{ transform: "none" }}
                />

                <Stack
                    sx={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 0.75,
                        mt: 1,
                    }}
                >
                    {[135, 108].map((width, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            width={width}
                            height={27}
                            sx={{ borderRadius: 1 }}
                        />
                    ))}
                </Stack>

                <Skeleton
                    variant="text"
                    width={125}
                    height={22}
                    sx={{ mt: 2, transform: "none" }}
                />

                <Skeleton
                    variant="rounded"
                    height={54}
                    sx={{ mt: 0.75, borderRadius: 1.5 }}
                />
            </Box>

            <Box sx={{ p: 2 }}>
                <Skeleton
                    variant="text"
                    width={145}
                    height={22}
                    sx={{ transform: "none" }}
                />

                <Stack sx={{ gap: 1.5, mt: 1.5 }}>
                    <Box>
                        <Skeleton
                            variant="text"
                            width={105}
                            height={18}
                            sx={{ transform: "none" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height={40}
                            sx={{ mt: 0.5, borderRadius: 1.5 }}
                        />
                    </Box>

                    <Box>
                        <Skeleton
                            variant="text"
                            width={115}
                            height={18}
                            sx={{ transform: "none" }}
                        />
                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height={72}
                            sx={{ mt: 0.5, borderRadius: 1.5 }}
                        />
                    </Box>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: 1,
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={125}
                            height={36}
                            sx={{ borderRadius: 1.5 }}
                        />
                    </Stack>
                </Stack>
            </Box>
        </Card>
    );
}
