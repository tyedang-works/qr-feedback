import { Box, Skeleton, Stack } from "@mui/material";

export default function FeedbackDetailLoading() {
    return (
        <Stack sx={{ gap: 3 }}>
            {/* Back link */}
            <Skeleton
                variant="text"
                width={150}
                height={24}
                sx={{ transform: "none" }}
            />

            {/* Page header */}
            <Stack sx={{ gap: 0.5 }}>
                <Skeleton
                    variant="text"
                    width={220}
                    height={40}
                    sx={{ transform: "none" }}
                />

                <Skeleton
                    variant="text"
                    width={320}
                    height={24}
                    sx={{ transform: "none" }}
                />
            </Stack>

            {/* Feedback information */}
            <Box
                sx={{
                    width: "100%",
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                }}
            >
                <Stack sx={{ px: 2.5, py: 2.5, gap: 2 }}>
                    {/* Table + created time */}
                    <Stack
                        sx={{
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        <Stack sx={{ gap: 0.25 }}>
                            <Skeleton
                                variant="text"
                                width={35}
                                height={20}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={80}
                                height={28}
                                sx={{ transform: "none" }}
                            />
                        </Stack>

                        <Skeleton
                            variant="text"
                            width={130}
                            height={20}
                            sx={{ transform: "none" }}
                        />
                    </Stack>

                    {/* Divider */}
                    <Box
                        sx={{
                            height: "1px",
                            width: "100%",
                            backgroundColor: "#e5e7eb",
                        }}
                    />

                    {/* Selected issues */}
                    <Stack sx={{ gap: 1 }}>
                        <Skeleton
                            variant="text"
                            width={180}
                            height={24}
                            sx={{ transform: "none" }}
                        />

                        <Stack
                            sx={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 0.75,
                            }}
                        >
                            {[1, 2, 3, 4].map((item) => (
                                <Skeleton
                                    key={item}
                                    variant="rounded"
                                    width={item === 4 ? 175 : 140}
                                    height={30}
                                    sx={{ borderRadius: 1 }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Box>

            {/* Customer feedback */}
            <Box
                sx={{
                    width: "100%",
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                }}
            >
                {/* Feedback content */}
                <Stack sx={{ px: 2.5, py: 2.5, gap: 1.25 }}>
                    <Skeleton
                        variant="text"
                        width={160}
                        height={24}
                        sx={{ transform: "none" }}
                    />

                    <Skeleton
                        variant="rounded"
                        width="100%"
                        height={54}
                        sx={{ borderRadius: 1.5 }}
                    />
                </Stack>

                {/* Divider */}
                <Box
                    sx={{
                        height: "1px",
                        width: "100%",
                        backgroundColor: "#e5e7eb",
                    }}
                />

                {/* Phone */}
                <Stack sx={{ px: 2.5, py: 2 }}>
                    <Skeleton
                        variant="text"
                        width={100}
                        height={20}
                        sx={{ transform: "none" }}
                    />

                    <Skeleton
                        variant="text"
                        width={110}
                        height={24}
                        sx={{ transform: "none" }}
                    />
                </Stack>
            </Box>
        </Stack>
    );
}
