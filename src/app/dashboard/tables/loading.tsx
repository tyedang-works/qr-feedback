import { Box, Skeleton, Stack } from "@mui/material";

export default function TablesLoading() {
    return (
        <Stack sx={{ gap: 3 }}>
            {/* Header */}
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Stack sx={{ gap: 1 }}>
                    <Skeleton
                        variant="text"
                        width={150}
                        height={36}
                        sx={{ transform: "none" }}
                    />

                    <Skeleton
                        variant="text"
                        width={280}
                        height={24}
                        sx={{ transform: "none" }}
                    />
                </Stack>

                <Skeleton
                    variant="rounded"
                    width={110}
                    height={40}
                    sx={{ borderRadius: 1.5 }}
                />
            </Stack>

            {/* Summary */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, minmax(0, 1fr))",
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

            {/* Table */}
            <Skeleton variant="rounded" height={560} sx={{ borderRadius: 2 }} />
        </Stack>
    );
}
