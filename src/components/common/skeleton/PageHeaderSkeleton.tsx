import { Box, Skeleton, Stack } from "@mui/material";

type PageHeaderSkeletonProps = {
    titleWidth?: number;
    subtitleWidth?: number;
};

export default function PageHeaderSkeleton({
    titleWidth = 260,
    subtitleWidth = 340,
}: PageHeaderSkeletonProps) {
    return (
        <Stack
            aria-hidden="true"
            sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                width: "100%",
                minWidth: 0,
            }}
        >
            <Skeleton
                variant="rounded"
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    flexShrink: 0,
                }}
            />

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Skeleton
                    variant="text"
                    sx={{
                        width: {
                            xs: Math.min(titleWidth, 200),
                            sm: titleWidth,
                        },
                        height: { xs: 30, sm: 34 },
                    }}
                />

                <Skeleton
                    variant="text"
                    sx={{
                        width: {
                            xs: "min(100%, 280px)",
                            sm: subtitleWidth,
                        },
                        maxWidth: "100%",
                        height: 22,
                    }}
                />
            </Box>
        </Stack>
    );
}
