import PageHeaderSkeleton from "@/components/common/skeleton/PageHeaderSkeleton";
import { Box, Skeleton, Stack } from "@mui/material";

const cardSx = {
    border: "1px solid #E5E7EB",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    minWidth: 0,
};

function FeedbackSummarySkeleton() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
                minWidth: 0,
            }}
        >
            {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ ...cardSx, p: { xs: 2, sm: 2 } }}>
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Skeleton
                                variant="text"
                                width={item === 3 ? 90 : 105}
                                height={20}
                                sx={{ transform: "none" }}
                            />
                            <Skeleton
                                variant="text"
                                width={45}
                                height={32}
                                sx={{ mt: 0.25, transform: "none" }}
                            />
                            <Skeleton
                                variant="text"
                                width={item === 1 ? 100 : 115}
                                height={18}
                                sx={{ mt: 0.25, transform: "none" }}
                            />
                        </Box>

                        <Skeleton
                            variant="rounded"
                            width={38}
                            height={38}
                            sx={{ flexShrink: 0, borderRadius: 1.5 }}
                        />
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}

function FeedbackToolbarSkeleton() {
    return (
        <Box sx={{ ...cardSx, p: { xs: 1.5, sm: 2 } }}>
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        height: 40,
                        flex: 1,
                        minWidth: 0,
                        borderRadius: 1,
                    }}
                />
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: { xs: 42, sm: 108 },
                        height: 38,
                        flexShrink: 0,
                        borderRadius: 1.5,
                    }}
                />
            </Stack>

            <Skeleton
                variant="text"
                width={145}
                height={20}
                sx={{ mt: 1.5, transform: "none" }}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 0.5,
                }}
            >
                {[80, 100, 98, 88].map((width, index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        width={width}
                        height={30}
                        sx={{ borderRadius: 1 }}
                    />
                ))}
            </Stack>
        </Box>
    );
}

function FeedbackCountSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
            }}
        >
            <Skeleton
                variant="text"
                width={155}
                height={22}
                sx={{ transform: "none" }}
            />

            <Skeleton
                variant="rounded"
                width={122}
                height={38}
                sx={{ borderRadius: 1.5 }}
            />
        </Stack>
    );
}

function FeedbackListSkeleton() {
    return (
        <Box sx={{ ...cardSx, overflow: "hidden" }}>
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
        </Box>
    );
}

function FeedbackDetailSkeleton() {
    return (
        <Box sx={{ ...cardSx, overflow: "hidden" }}>
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
                            width={90}
                            height={36}
                            sx={{ borderRadius: 1.5 }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={125}
                            height={36}
                            sx={{ borderRadius: 1.5 }}
                        />
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}

function FeedbackPaginationSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 1.5,
            }}
        >
            <Skeleton
                variant="text"
                width={180}
                height={20}
                sx={{ transform: "none" }}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: { xs: "flex-start", sm: "flex-end" },
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={70}
                    height={36}
                    sx={{ borderRadius: 1 }}
                />
                {[1, 2, 3].map((item) => (
                    <Skeleton
                        key={item}
                        variant="rounded"
                        width={36}
                        height={36}
                        sx={{ borderRadius: 1 }}
                    />
                ))}
                <Skeleton
                    variant="rounded"
                    width={70}
                    height={36}
                    sx={{ borderRadius: 1 }}
                />
            </Stack>
        </Stack>
    );
}

export default function FeedbackLoading() {
    return (
        <Stack
            aria-label="Đang tải phản hồi"
            sx={{
                width: "100%",
                minWidth: 0,
                mx: "auto",
                gap: { xs: 2, md: 2.5 },
            }}
        >
            <PageHeaderSkeleton titleWidth={150} subtitleWidth={300} />

            <FeedbackSummarySkeleton />

            <FeedbackToolbarSkeleton />

            <FeedbackCountSkeleton />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1fr) minmax(0, 1.25fr)",
                    },
                    gap: 2,
                    alignItems: "start",
                    minWidth: 0,
                }}
            >
                <FeedbackListSkeleton />
                <Box sx={{ display: { xs: "none", lg: "block" }, minWidth: 0 }}>
                    <FeedbackDetailSkeleton />
                </Box>
            </Box>

            <FeedbackPaginationSkeleton />
        </Stack>
    );
}
