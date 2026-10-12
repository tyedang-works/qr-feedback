import { Box, Skeleton, Stack } from "@mui/material";

function SettingsSectionSkeleton() {
    return (
        <Stack sx={{ gap: 2 }}>
            {/* Section heading */}
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={38}
                    height={38}
                    sx={{
                        borderRadius: 2,
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton variant="text" width={145} height={22} />
                    <Skeleton variant="text" width={220} height={18} />
                </Box>
            </Stack>

            {/* Form fields */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: {
                        xs: 2.5,
                        md: 3,
                    },
                }}
            >
                {[1, 2].map((item) => (
                    <Stack key={item} sx={{ gap: 0.75 }}>
                        <Skeleton
                            variant="text"
                            width={item === 1 ? 105 : 115}
                            height={20}
                        />
                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height={40}
                            sx={{ borderRadius: 1 }}
                        />
                    </Stack>
                ))}
            </Box>
        </Stack>
    );
}

export default function SettingsLoading() {
    return (
        <Stack
            aria-label="Đang tải cài đặt nhà hàng"
            sx={{
                gap: { xs: 3, md: 4 },
                width: "100%",
                minWidth: 0,
            }}
        >
            {/* Page header */}
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={48}
                    height={48}
                    sx={{
                        borderRadius: 2.5,
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Skeleton
                        variant="text"
                        sx={{
                            width: { xs: 200, sm: 260 },
                            height: 34,
                        }}
                    />
                    <Skeleton
                        variant="text"
                        sx={{
                            width: { xs: 250, sm: 340 },
                            height: 22,
                        }}
                    />
                </Box>
            </Stack>

            {/* Settings card */}
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
                {/* Form content: match page.tsx padding */}
                <Stack
                    sx={{
                        gap: 3,
                        px: { xs: 2.5, sm: 3.5 },
                        py: { xs: 3, sm: 3.5 },
                    }}
                >
                    <SettingsSectionSkeleton />

                    {/* Section divider */}
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
                                borderRadius: 2,
                            }}
                            height={42}
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
                        width={14}
                        height={14}
                        sx={{ flexShrink: 0 }}
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
        </Stack>
    );
}
