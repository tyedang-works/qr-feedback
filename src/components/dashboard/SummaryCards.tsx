import {
    Box,
    Card,
    Stack,
    Typography,
} from "@mui/material";

type SummaryCardsProps = {
    totalFeedback: number;
    todayFeedback: number;
    activeTables: number;
};

export default function SummaryCards({
    totalFeedback,
    todayFeedback,
    activeTables,
}: SummaryCardsProps) {
    const summaryItems = [
        {
            label: "Total Feedback",
            value: totalFeedback,
        },
        {
            label: "Today",
            value: todayFeedback,
        },
        {
            label: "Tables",
            value: activeTables,
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                },
                gap: 2,
            }}
        >
            {summaryItems.map((item) => (
                <Card
                    key={item.label}
                    elevation={0}
                    sx={{
                        p: 2.5,
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Stack sx={{ gap: 1 }}>
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#667085",
                            }}
                        >
                            {item.label}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 28,
                                lineHeight: 1,
                                fontWeight: 700,
                                color: "#193B56",
                            }}
                        >
                            {item.value}
                        </Typography>
                    </Stack>
                </Card>
            ))}
        </Box>
    );
}