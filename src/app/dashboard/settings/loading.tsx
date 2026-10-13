import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";

function SettingsSectionSkeleton() {
    return (
        <Stack sx={{ gap: 2 }}>
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton variant="text" sx={{ width: 145, height: 22 }} />
                    <Skeleton variant="text" sx={{ width: 220, height: 18 }} />
                </Box>
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: { xs: 2.5, md: 3 },
                }}
            >
                {[1, 2].map((item) => (
                    <Stack key={item} sx={{ gap: 0.75 }}>
                        <Skeleton
                            variant="text"
                            sx={{
                                width: item === 1 ? 105 : 115,
                                height: 20,
                            }}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{
                                width: "100%",
                                height: 40,
                                borderRadius: 1,
                            }}
                        />
                    </Stack>
                ))}
            </Box>
        </Stack>
    );
}

export default function SettingsLoading() {
    return (
        <PageLoadingSkeleton titleWidth={260} subtitleWidth={340} gap={3}>
            <Box
                sx={{
                    width: "100%",
                    border: "1px solid #E4E7EC",
                    borderRadius: 3,
                    bgcolor: "#FFFFFF",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(16, 24, 40, 0.03)",
                }}
            >
                <Stack
                    sx={{
                        gap: 3,
                        px: { xs: 2.5, sm: 3.5 },
                        py: { xs: 3, sm: 3.5 },
                    }}
                >
                    <SettingsSectionSkeleton />

                    <Box
                        sx={{
                            height: "1px",
                            bgcolor: "#EAECF0",
                        }}
                    />

                    <SettingsSectionSkeleton />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            pt: 2,
                            borderTop: "1px solid #EAECF0",
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            sx={{
                                width: { xs: "100%", sm: 160 },
                                height: 42,
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: { xs: 2.5, sm: 3.5 },
                        py: 2,
                        borderTop: "1px solid #EAECF0",
                        bgcolor: "#FCFCFD",
                    }}
                >
                    <Skeleton
                        variant="circular"
                        sx={{
                            width: 14,
                            height: 14,
                            flexShrink: 0,
                        }}
                    />

                    <Skeleton
                        variant="text"
                        sx={{
                            width: { xs: "85%", sm: 350 },
                            height: 18,
                        }}
                    />
                </Box>
            </Box>
        </PageLoadingSkeleton>
    );
}
