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
            : [{ name: "Chưa có dữ liệu", value: 1, color: "#EAECF0" }];

    return (
        <Box
            sx={{
                width: size,
                height: size,
                flexShrink: 0,
                position: "relative",
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
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
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>

            {centerLabel && (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#193B56",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {centerLabel}
                </Box>
            )}
        </Box>
    );
}
