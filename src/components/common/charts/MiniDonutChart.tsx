"use client";

import { Box } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DonutSegment = {
    name: string;
    value: number;
    color: string;
};

type MiniDonutChartProps = {
    data: DonutSegment[];
    centerLabel?: string;
    showTooltip?: boolean;
    size?: number;
};

export default function MiniDonutChart({
    data,
    centerLabel,
    showTooltip = false,
    size = 84,
}: MiniDonutChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const chartData =
        total > 0
            ? data
            : [
                  {
                      name: "Chưa có dữ liệu",
                      value: 1,
                      color: "var(--color-chart-track, #374151)",
                  },
              ];

    return (
        <Box
            sx={{
                width: size,
                height: size,
                flexShrink: 0,
                position: "relative",
            }}
        >
            <ResponsiveContainer
                width="100%"
                height="100%"
                style={{
                    pointerEvents: "none",
                }}
            >
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="96%"
                        paddingAngle={total > 0 ? 2 : 0}
                        stroke="none"
                        isAnimationActive={false}
                    >
                        {chartData.map((item, index) => (
                            <Cell
                                key={`${item.name}-${index}`}
                                fill={item.color}
                            />
                        ))}
                    </Pie>

                    {showTooltip && total > 0 && (
                        <Tooltip
                            formatter={(value, name) => [
                                Number(value).toLocaleString("vi-VN"),
                                String(name),
                            ]}
                            contentStyle={{
                                backgroundColor:
                                    "var(--color-surface, #FFFFFF)",
                                border: "1px solid var(--color-border, #E5E7EB)",
                                borderRadius: 8,
                                color: "var(--color-text-primary, #111827)",
                                boxShadow: "var(--shadow-card)",
                            }}
                            labelStyle={{
                                color: "var(--color-text-primary, #111827)",
                            }}
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>

            {centerLabel && (
                <Box
                    component="span"
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        fontSize: 11,
                        lineHeight: 1,
                        fontWeight: 650,
                        color: "var(--color-text-primary, #111827)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {centerLabel}
                </Box>
            )}
        </Box>
    );
}
