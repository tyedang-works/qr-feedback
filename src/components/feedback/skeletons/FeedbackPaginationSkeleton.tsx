import { Skeleton, Stack } from "@mui/material";

export default function FeedbackPaginationSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: {
                    xs: "center",
                    sm: "space-between",
                },
                gap: 1.5,
                minWidth: 0,
            }}
        >
            <Skeleton
                variant="text"
                width={200}
                height={20}
                sx={{ transform: "none", flexShrink: 0 }}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                        key={item}
                        variant="rounded"
                        width={36}
                        height={36}
                        sx={{ borderRadius: 1 }}
                    />
                ))}
            </Stack>
        </Stack>
    );
}
