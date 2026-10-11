import {
    faCalendarCheck,
    faList,
    faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, Stack, Typography } from "@mui/material";

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
            label: "Tổng phản hồi",
            value: totalFeedback,
            color: "#193B56",
            backgroundColor: "#EEF4F8",
            indicator: "#193B56",
            icon: faList,
        },
        {
            label: "Hôm nay",
            value: todayFeedback,
            color: "#193B56",
            backgroundColor: "#FFF5E8",
            indicator: "#E89A42",
            icon: faCalendarCheck,
        },
        {
            label: "Bàn đang hoạt động",
            value: activeTables,
            color: "#193B56",
            backgroundColor: "#ECFDF3",
            indicator: "#12B76A",
            icon: faTableCells,
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
            }}
        >
            {summaryItems.map((item) => {
                return (
                    <Card
                        key={item.label}
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 2.5 },
                            border: "1px solid #E5E7EB",
                            borderRadius: 2.5,
                            backgroundColor: item.backgroundColor,
                            minWidth: 0,
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        item.label === "Tổng phản hồi"
                                            ? "transparent"
                                            : "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "none",
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    size="sm"
                                    style={{
                                        color: item.indicator,
                                        fontSize: "18px",
                                    }}
                                />
                            </Box>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#667085",
                                        mb: 0.5,
                                    }}
                                >
                                    {item.label}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: { xs: 25, sm: 28 },
                                        lineHeight: 1.2,
                                        fontWeight: 700,
                                        color: item.color,
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {item.value.toLocaleString("vi-VN")}
                                </Typography>
                            </Box>
                        </Stack>
                    </Card>
                );
            })}
        </Box>
    );
}
