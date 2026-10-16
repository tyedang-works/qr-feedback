import { cardSx } from "@/styles/card.styles";
import { Card, Skeleton, Stack } from "@mui/material";

export default function TablesFilterSkeleton() {
    return (
        <Card sx={cardSx}>
            <Stack
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "stretch",
                    gap: 1.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: "100%",
                        flex: 1,
                        minWidth: 0,
                        height: 40,
                        borderRadius: 1.5,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    sx={{
                        width: { xs: "100%", sm: 230 },
                        height: 40,
                        borderRadius: 1.5,
                        flexShrink: 0,
                    }}
                />
            </Stack>

            <Stack
                sx={{
                    mt: 1.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Skeleton variant="text" sx={{ width: 120, height: 20 }} />
            </Stack>
        </Card>
    );
}
