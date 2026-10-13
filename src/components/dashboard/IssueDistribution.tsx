"use client";

import type { IssueDistributionItem } from "@/lib/dashboard/types";
import { Box, Card, Typography } from "@mui/material";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

type IssueDistributionProps = {
    data: IssueDistributionItem[];
};

export default function IssueDistribution({ data }: IssueDistributionProps) {
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
                Phân bố vấn đề
            </Typography>

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#667085",
                }}
            >
                Các vấn đề khách hàng lựa chọn
            </Typography>

            <Box
                sx={{
                    mt: 2,
                    width: "100%",
                    height: 240,
                    "& .recharts-wrapper": {
                        outline: "none",
                    },
                    "& .recharts-surface": {
                        outline: "none",
                    },
                    "& .recharts-layer": {
                        outline: "none",
                    },
                    // "& .recharts-tooltip-wrapper": {
                    //     display: "none !important",
                    // },
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        accessibilityLayer={false}
                        style={{ outline: "none" }}
                        margin={{
                            top: 4,
                            right: 12,
                            left: 8,
                            bottom: 4,
                        }}
                    >
                        <CartesianGrid
                            stroke="#EAECF0"
                            strokeDasharray="3 3"
                            horizontal={false}
                        />

                        <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{
                                fontSize: 11,
                                fill: "#667085",
                                fontFamily:
                                    "var(--font-momo-trust-sans), sans-serif",
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            type="category"
                            dataKey="label"
                            width={160}
                            tick={{
                                fontSize: 11,
                                fill: "#344054",
                                fontFamily:
                                    "var(--font-momo-trust-sans), sans-serif",
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip
                            active={undefined}
                            trigger="hover"
                            cursor={false}
                            isAnimationActive={false}
                            formatter={(value, _name, item) => [
                                `${Number(value ?? 0).toLocaleString("vi-VN")} lượt (${item.payload.percentage}%)`,
                                "Số phản hồi",
                            ]}
                            contentStyle={{
                                border: "1px solid #EAECF0",
                                borderRadius: 8,
                                fontSize: 12,
                                fontFamily:
                                    "var(--font-momo-trust-sans), sans-serif",
                                boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",
                                outline: "none",
                            }}
                            itemStyle={{
                                color: "#193B56",
                            }}
                            labelStyle={{
                                color: "#344054",
                                fontWeight: 600,
                                marginBottom: 4,
                            }}
                        />

                        <Bar
                            dataKey="count"
                            name="Số phản hồi"
                            radius={[0, 5, 5, 0]}
                            maxBarSize={26}
                            activeBar={false}
                            isAnimationActive={false}
                        >
                            {data.map((item) => (
                                <Cell
                                    key={item.option}
                                    fill="#193B56"
                                    stroke="none"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Card>
    );
}
