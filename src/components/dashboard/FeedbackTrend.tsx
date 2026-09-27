import type { FeedbackTrendItem } from "@/lib/dashboard/types";
import {
    Box,
    Card,
    Stack,
    Typography,
} from "@mui/material";

type FeedbackTrendProps = {
    data: FeedbackTrendItem[];
};

export default function FeedbackTrend({
    data,
}: FeedbackTrendProps) {
    const maxCount = Math.max(
        ...data.map((item) => item.count),
        1,
    );

    return (
        <Card
            elevation={0}
            sx={{
                p: 3,
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                backgroundColor: "#ffffff",
            }}
        >
            <Typography
                sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#193B56",
                }}
            >
                Feedback Trend
            </Typography>

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#667085",
                }}
            >
                Phản hồi trong 7 ngày gần nhất
            </Typography>

            <Stack
                sx={{
                    mt: 4,
                    height: 220,
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: {
                        xs: 1,
                        sm: 2,
                    },
                }}
            >
                {data.map((item) => {
                    const height =
                        item.count === 0
                            ? 4
                            : Math.max(
                                (item.count / maxCount) * 180,
                                12,
                            );

                    return (
                        <Stack
                            key={item.date}
                            sx={{
                                flex: 1,
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#193B56",
                                }}
                            >
                                {item.count}
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    maxWidth: 44,
                                    height,
                                    borderRadius: "6px 6px 2px 2px",
                                    backgroundColor: "#193B56",
                                    transition:
                                        "height 300ms ease",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#667085",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Card>
    );
}