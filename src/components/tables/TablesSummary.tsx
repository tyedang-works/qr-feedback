"use client";

import MiniDonutChart from "@/components/common/charts/MiniDonutChart";
import type { RestaurantTableSummary } from "@/lib/tables/queries";
import { cardSx } from "@/styles/card.styles";
import { Box, Card, Stack, Typography } from "@mui/material";

type TablesSummaryProps = {
    data: RestaurantTableSummary;
};

const SUMMARY_ITEMS = [
    {
        key: "total",
        label: "Tổng số bàn",
        color: "#2563EB",
        description: "Toàn bộ bàn của nhà hàng",
    },
    {
        key: "active",
        label: "Đang hoạt động",
        color: "#039855",
        description: "bàn đang hoạt động",
    },
    {
        key: "inactive",
        label: "Đã tắt",
        color: "#EA580C",
        description: "bàn đã tắt",
    },
] as const;

function formatNumber(value: number): string {
    return value.toLocaleString("vi-VN");
}

function getPercentage(value: number, total: number): number {
    if (total <= 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
}

export default function TablesSummary({ data }: TablesSummaryProps) {
    const total = data.total;

    const totalDonutData = [
        {
            name: "Đang hoạt động",
            value: data.active,
            color: "#039855",
        },
        {
            name: "Đã tắt",
            value: data.inactive,
            color: "#EA580C",
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 1.25, sm: 2 },
                width: "100%",
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {SUMMARY_ITEMS.map((item) => {
                const value = data[item.key];
                const isTotal = item.key === "total";
                const percentage = getPercentage(value, total);

                const chartData = isTotal
                    ? totalDonutData
                    : [
                          {
                              name: item.label,
                              value,
                              color: item.color,
                          },
                          {
                              name: "Còn lại",
                              value: Math.max(total - value, 0),
                              color: "var(--color-surface-active, #F3F4F6)",
                          },
                      ];

                return (
                    <Card key={item.key} elevation={0} sx={cardSx}>
                        <Stack
                            sx={{
                                height: "100%",
                                minWidth: 0,
                                justifyContent: "space-between",
                                gap: 0.5,
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1.5,
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        fontSize: { xs: 13, sm: 15 },
                                        lineHeight: 1.5,
                                        fontWeight: 600,
                                        color: "var(--color-text-secondary, #193B56)",
                                    }}
                                >
                                    {item.label}
                                </Typography>

                                <MiniDonutChart
                                    data={chartData}
                                    size={68}
                                    centerLabel={
                                        isTotal
                                            ? formatNumber(total)
                                            : `${percentage}%`
                                    }
                                />
                            </Stack>

                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "baseline",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        fontSize: { xs: 27, sm: 30 },
                                        lineHeight: 1.2,
                                        fontWeight: 700,
                                        letterSpacing: "-0.7px",
                                        color: "var(--color-text-primary, #193B56)",
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {formatNumber(value)}
                                </Typography>
                            </Stack>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: "var(--color-text-secondary, #667085)",
                                }}
                            >
                                {isTotal
                                    ? item.description
                                    : `${formatNumber(value)} trên ${formatNumber(total)} bàn`}
                            </Typography>
                        </Stack>
                    </Card>
                );
            })}
        </Box>
    );
}
