"use client";

import type { FeedbackTrendItem } from "@/lib/dashboard/types";
import { Box, Card, Stack, Typography } from "@mui/material";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type SummaryCardsProps = {
    totalFeedback: number;
    todayFeedback: number;
    activeTables: number;
    inactiveTables: number;
    feedbackTrend: FeedbackTrendItem[];
    last7DaysFeedback: number;
    previous7DaysFeedback: number;
    yesterdayFeedback: number;
};

type MiniBarChartProps = {
    data: number[];
    color: string;
};

function MiniBarChart({ data, color }: MiniBarChartProps) {
    const maxValue = Math.max(...data, 1);

    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                gap: "3px",
                width: 60,
                height: 36,
                flexShrink: 0,
            }}
            aria-hidden="true"
        >
            {data.map((value, index) => (
                <Box
                    key={index}
                    sx={{
                        flex: "1 1 0",
                        minWidth: 3,
                        maxWidth: 5,
                        height: `${Math.max((value / maxValue) * 100, 5)}%`,
                        borderRadius: "2px 2px 0 0",
                        bgcolor: color,
                    }}
                />
            ))}
        </Stack>
    );
}

function formatNumber(value: number) {
    return value.toLocaleString("vi-VN");
}

function getChange(current: number, previous: number) {
    if (previous === 0) {
        if (current === 0) {
            return { value: 0, direction: "neutral" as const };
        }

        return { value: null, direction: "up" as const };
    }

    const difference = Math.round(((current - previous) / previous) * 100);

    return {
        value: Math.abs(difference),
        direction:
            difference > 0
                ? ("up" as const)
                : difference < 0
                  ? ("down" as const)
                  : ("neutral" as const),
    };
}

function ComparisonText({
    current,
    previous,
    suffix,
}: {
    current: number;
    previous: number;
    suffix: string;
}) {
    const change = getChange(current, previous);

    const color =
        change.direction === "neutral"
            ? "var(--color-text-secondary, #6B7280)"
            : change.direction === "up"
              ? "#DC4545"
              : "#059669";

    const Icon =
        change.direction === "up"
            ? TrendingUp
            : change.direction === "down"
              ? TrendingDown
              : Minus;

    const sign =
        change.direction === "up"
            ? "+"
            : change.direction === "down"
              ? "-"
              : "";

    const value =
        change.value === null
            ? `+${formatNumber(current)}`
            : `${sign}${change.value}%`;

    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.5,
                minWidth: 0,
            }}
        >
            <Icon size={16} strokeWidth={2} color={color} aria-hidden="true" />

            <Typography
                component="span"
                sx={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    color,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {value}
            </Typography>

            <Typography
                component="span"
                sx={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--color-text-secondary, #6B7280)",
                }}
            >
                {suffix}
            </Typography>
        </Stack>
    );
}

type SummaryCardItemProps = {
    label: string;
    value: string;
    comparison: ReactNode;
    chartData: number[];
    chartColor: string;
};

function SummaryCardItem({
    label,
    value,
    comparison,
    chartData,
    chartColor,
}: SummaryCardItemProps) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                p: { xs: 2, sm: 2.5 },
                border: "1px solid var(--color-border, #F0F2F5)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    justifyContent: "space-between",
                    gap: 1.5,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        fontWeight: 400,
                        color: "var(--color-text-primary, #111827)",
                    }}
                >
                    {label}
                </Typography>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
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
                            color: "var(--color-text-primary, #111827)",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {value}
                    </Typography>

                    <MiniBarChart data={chartData} color={chartColor} />
                </Stack>
                <Box sx={{ minWidth: 0, minHeight: 18 }}>{comparison}</Box>
            </Stack>
        </Card>
    );
}

export default function SummaryCards({
    totalFeedback,
    todayFeedback,
    activeTables,
    inactiveTables,
    feedbackTrend,
    last7DaysFeedback,
    previous7DaysFeedback,
    yesterdayFeedback,
}: SummaryCardsProps) {
    const trendData = feedbackTrend.map((item) => item.count);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            <SummaryCardItem
                label="Tổng phản hồi"
                value={formatNumber(totalFeedback)}
                chartData={trendData}
                chartColor="#10B981"
                comparison={
                    <ComparisonText
                        current={last7DaysFeedback}
                        previous={previous7DaysFeedback}
                        suffix="so với 7 ngày trước"
                    />
                }
            />

            <SummaryCardItem
                label="Hôm nay"
                value={formatNumber(todayFeedback)}
                chartData={trendData}
                chartColor="#06B6D4"
                comparison={
                    <ComparisonText
                        current={todayFeedback}
                        previous={yesterdayFeedback}
                        suffix="so với hôm qua"
                    />
                }
            />

            <SummaryCardItem
                label="Bàn đang hoạt động"
                value={`${formatNumber(activeTables)}/${formatNumber(
                    activeTables + inactiveTables,
                )}`}
                chartData={[activeTables, inactiveTables]}
                chartColor="#F97316"
                comparison={
                    <Typography
                        component="p"
                        sx={{
                            m: 0,
                            fontSize: 12,
                            lineHeight: 1.5,
                            color: "var(--color-text-secondary, #6B7280)",
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                color: "#059669",
                                fontWeight: 500,
                            }}
                        >
                            {formatNumber(activeTables)} đang hoạt động
                        </Box>
                        {" · "}
                        {formatNumber(inactiveTables)} đã tắt
                    </Typography>
                }
            />
        </Box>
    );
}
