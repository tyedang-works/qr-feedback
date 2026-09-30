import { Box, Skeleton, Stack } from "@mui/material";

export default function FeedbackLoading() {
    return (
        <Stack sx={{ gap: 2 }}>
            {/* Header */}
            <Stack sx={{ gap: 1 }}>
                <Skeleton
                    variant="text"
                    width={180}
                    height={36}
                    sx={{ transform: "none" }}
                />

                <Skeleton
                    variant="text"
                    width={320}
                    height={24}
                    sx={{ transform: "none" }}
                />
            </Stack>

            {/* Filter */}
            <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />

            {/* Table */}
            <Skeleton variant="rounded" height={520} sx={{ borderRadius: 2 }} />

            {/* Pagination */}
            <Stack
                sx={{
                    alignItems: "flex-end",
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={240}
                    height={40}
                    sx={{ borderRadius: 1 }}
                />
            </Stack>
        </Stack>
    );
}
