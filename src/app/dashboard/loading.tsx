import { Box, Skeleton, Stack } from "@mui/material";

export default function DashboardLoading() {
    return (
        <Stack sx={{ gap: 3 }}>
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
                    width={300}
                    height={24}
                    sx={{ transform: "none" }}
                />
            </Stack>

            {/* Summary cards */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                }}
            >
                {[1, 2, 3].map((item) => (
                    <Skeleton
                        key={item}
                        variant="rounded"
                        height={110}
                        sx={{ borderRadius: 2 }}
                    />
                ))}
            </Box>

            {/* Charts */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "2fr 1fr",
                    },
                    gap: 2,
                }}
            >
                <Skeleton
                    variant="rounded"
                    height={360}
                    sx={{ borderRadius: 2 }}
                />

                <Skeleton
                    variant="rounded"
                    height={360}
                    sx={{ borderRadius: 2 }}
                />
            </Box>

            {/* Recent feedback */}
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: 2 }} />
        </Stack>
    );
}
