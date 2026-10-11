"use client";

import type { FeedbackStatusDistributionItem } from "@/lib/dashboard/types";
import { Box, Card, Stack, Typography } from "@mui/material";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type FeedbackStatusChartProps = {
    data: FeedbackStatusDistributionItem[];
};

const STATUS_COLORS: Record<FeedbackStatusDistributionItem["status"], string> =
    {
        new: "#D92D20",
        in_progress: "#1570EF",
        resolved: "#12B76A",
    };

export default function FeedbackStatusChart({
    data,
}: FeedbackStatusChartProps) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px solid #E5E7EB",
                borderRadius: 2.5,
                backgroundColor: "#FFFFFF",
                minWidth: 0,
                height: "100%",
            }}
        >
            <Typography
                sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#193B56",
                }}
            >
                Trạng thái phản hồi
            </Typography>

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#667085",
                }}
            >
                Phân bố theo tình trạng xử lý
            </Typography>

            {total === 0 ? (
                <Box
                    sx={{
                        height: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#667085",
                            textAlign: "center",
                        }}
                    >
                        Chưa có dữ liệu phản hồi.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ mt: 1, width: "100%", height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="label"
                                innerRadius="55%"
                                outerRadius="75%"
                                paddingAngle={3}
                                stroke="none"
                            >
                                {data.map((item) => (
                                    <Cell
                                        key={item.status}
                                        fill={STATUS_COLORS[item.status]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value ?? 0).toLocaleString("vi-VN")} phản hồi`,
                                    "Số lượng",
                                ]}
                                contentStyle={{
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontFamily:
                                        "var(--font-momo-trust-sans), sans-serif",
                                }}
                            />

                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => (
                                    <span
                                        style={{
                                            color: "#344054",
                                            fontSize: 12,
                                            fontFamily:
                                                "var(--font-momo-trust-sans), sans-serif",
                                        }}
                                    >
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            )}

            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: 1.5,
                    mt: 1,
                    borderTop: "1px solid #EAECF0",
                }}
            >
                <Typography sx={{ fontSize: 13, color: "#667085" }}>
                    Tổng số phản hồi
                </Typography>

                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#193B56",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {total.toLocaleString("vi-VN")}
                </Typography>
            </Stack>
        </Card>
    );
}
