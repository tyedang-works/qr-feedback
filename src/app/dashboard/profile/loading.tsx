import { Box, Skeleton, Stack } from "@mui/material";

import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";
import { cardSx } from "@/styles/card.styles";

function AvatarCardSkeleton() {
    return (
        <Box
            sx={{
                ...cardSx,
                p: 3,
                minWidth: 0,
                minHeight: 409,
            }}
        >
            <Stack
                sx={{
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Skeleton
                    variant="circular"
                    width={200}
                    height={200}
                    animation="wave"
                />

                <Stack
                    sx={{
                        alignItems: "center",
                        gap: 1,
                        width: "100%",
                    }}
                >
                    <Skeleton
                        variant="text"
                        width={130}
                        height={30}
                        animation="wave"
                    />
                    <Skeleton
                        variant="rounded"
                        width={65}
                        height={26}
                        animation="wave"
                    />
                </Stack>

                <Stack
                    sx={{
                        alignItems: "center",
                        width: "100%",
                        mt: 0.5,
                    }}
                >
                    <Skeleton variant="text" width="90%" animation="wave" />
                    <Skeleton variant="text" width="70%" animation="wave" />
                </Stack>
            </Stack>
        </Box>
    );
}

function ProfileFormSkeleton() {
    return (
        <Box
            sx={{
                ...cardSx,
                p: 3,
                minWidth: 0,
                minHeight: 409,
            }}
        >
            <Stack sx={{ gap: 1 }}>
                <Skeleton
                    variant="text"
                    width={180}
                    height={28}
                    animation="wave"
                />
                <Skeleton
                    variant="text"
                    width={300}
                    animation="wave"
                    sx={{ maxWidth: "100%" }}
                />
            </Stack>

            <Stack sx={{ gap: 2.25, mt: 2.5 }}>
                <Stack sx={{ gap: 0.75 }}>
                    <Skeleton
                        variant="text"
                        width={85}
                        height={20}
                        animation="wave"
                    />
                    <Skeleton
                        variant="rounded"
                        height={42}
                        animation="wave"
                        sx={{ borderRadius: 1 }}
                    />
                </Stack>

                <Stack sx={{ gap: 0.75 }}>
                    <Skeleton
                        variant="text"
                        width={45}
                        height={20}
                        animation="wave"
                    />
                    <Skeleton
                        variant="rounded"
                        height={42}
                        animation="wave"
                        sx={{ borderRadius: 1 }}
                    />
                </Stack>
            </Stack>

            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    mt: 2.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={116}
                    height={40}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                />
                <Skeleton
                    variant="rounded"
                    width={114}
                    height={40}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                />
            </Stack>
        </Box>
    );
}

export default function ProfileLoading() {
    return (
        <PageLoadingSkeleton titleWidth={160} subtitleWidth={300}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "320px minmax(0, 1fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",
                }}
            >
                <AvatarCardSkeleton />
                <ProfileFormSkeleton />
            </Box>
        </PageLoadingSkeleton>
    );
}
