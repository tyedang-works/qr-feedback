"use client";

import MiniDonutChart from "@/components/common/charts/MiniDonutChart";
import { useTranslation } from "@/components/common/providers/useTranslation";
import type { RestaurantTableSummary } from "@/lib/tables/queries";
import { cardSx } from "@/styles/card.styles";
import { Box, Card, Stack, Typography } from "@mui/material";

type TablesSummaryProps = {
    data: RestaurantTableSummary;
};

const SUMMARY_ITEMS = [
    {
        key: "total",
        labelKey: "totalTables",
        color: "#2563EB",
    },
    {
        key: "active",
        labelKey: "activeTables",
        color: "#039855",
    },
    {
        key: "inactive",
        labelKey: "inactiveTables",
        color: "#EA580C",
    },
] as const;

function formatNumber(value: number, locale: string): string {
    return value.toLocaleString(locale === "en" ? "en-US" : "vi-VN");
}

function getPercentage(value: number, total: number): number {
    if (total <= 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
}

export default function TablesSummary({ data }: TablesSummaryProps) {
    const { t, locale } = useTranslation();

    const total = data.total;

    const totalDonutData = [
        {
            name: t("table", "activeTables"),
            value: data.active,
            color: "#039855",
        },
        {
            name: t("table", "inactiveTables"),
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
                const label = t("table", item.labelKey);

                const chartData = isTotal
                    ? totalDonutData
                    : [
                          {
                              name: label,
                              value,
                              color: item.color,
                          },
                          {
                              name: t("table", "remaining"),
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
                                    {label}
                                </Typography>

                                <MiniDonutChart
                                    data={chartData}
                                    size={68}
                                    centerLabel={
                                        isTotal
                                            ? formatNumber(total, locale)
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
                                    {formatNumber(value, locale)}
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
                                    ? t("table", "allRestaurantTables")
                                    : `${formatNumber(value, locale)} ${t("table", "of")} ${formatNumber(total, locale)} ${t("table", "tables")}`}
                            </Typography>
                        </Stack>
                    </Card>
                );
            })}
        </Box>
    );
}
