import { cardSx } from "@/styles/card.styles";
import { Card, Skeleton, Stack } from "@mui/material";

export default function FeedbackToolbarSkeleton() {
    return (
        <Card elevation={0} sx={cardSx}>
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
        </Card>
    );
}
