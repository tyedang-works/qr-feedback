"use client";

import { FEEDBACK_STATUS, STATUS_CONFIG } from "@/lib/feedback/constants";
import type { FeedbackSummary as FeedbackSummaryData } from "@/lib/feedback/types";
import { cardSx } from "@/styles/card.styles";
import { Box, Card, Stack, Typography } from "@mui/material";
import MiniDonutChart from "../common/charts/MiniDonutChart";

type FeedbackSummaryProps = {
    data: FeedbackSummaryData;
};

type SummaryItem = {
    key: "total" | "new" | "inProgress" | "resolved";
    label: string;
    color: string;
};

type DonutSegment = {
    name: string;
    value: number;
    color: string;
};

const SUMMARY_ITEMS: SummaryItem[] = [
    {
        key: "total",
        label: "Tổng phản hồi",
        color: "#193B56",
    },
    {
        key: "new",
        label: STATUS_CONFIG[FEEDBACK_STATUS.NEW].label,
        color: "#EF4444",
    },
    {
        key: "inProgress",
        label: STATUS_CONFIG[FEEDBACK_STATUS.IN_PROGRESS].label,
        color: "#3B82F6",
    },
    {
        key: "resolved",
        label: STATUS_CONFIG[FEEDBACK_STATUS.RESOLVED].label,
        color: "#10B981",
    },
];

const STATUS_COLORS = {
    new: "#EF4444",
    inProgress: "#3B82F6",
    resolved: "#10B981",
};

function formatNumber(value: number): string {
    return value.toLocaleString("vi-VN");
}

function getPercentage(value: number, total: number): number {
    if (total <= 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
}

function getTotalSegments(data: FeedbackSummaryData): DonutSegment[] {
    return [
        {
            name: STATUS_CONFIG[FEEDBACK_STATUS.NEW].label,
            value: data.new,
            color: STATUS_COLORS.new,
        },
        {
            name: STATUS_CONFIG[FEEDBACK_STATUS.IN_PROGRESS].label,
            value: data.inProgress,
            color: STATUS_COLORS.inProgress,
        },
        {
            name: STATUS_CONFIG[FEEDBACK_STATUS.RESOLVED].label,
            value: data.resolved,
            color: STATUS_COLORS.resolved,
        },
    ];
}

function getStatusSegments(
    label: string,
    value: number,
    total: number,
    color: string,
): DonutSegment[] {
    return [
        {
            name: label,
            value,
            color,
        },
        {
            name: "Còn lại",
            value: Math.max(total - value, 0),
            color: "var(--color-chart-track, #374151)",
        },
    ];
}

type SummaryCardProps = {
    item: SummaryItem;
    value: number;
    total: number;
    chartData: DonutSegment[];
};

function SummaryCard({ item, value, total, chartData }: SummaryCardProps) {
    const isTotal = item.key === "total";
    const percentage = getPercentage(value, total);

    return (
        <Card elevation={0} sx={cardSx}>
            <Stack
                sx={{
                    minWidth: 0,
                    minHeight: 112,
                    height: "100%",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.25,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        sx={{
                            minWidth: 0,
                            fontSize: { xs: 13, sm: 15 },
                            lineHeight: 1.45,
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {item.label}
                    </Typography>

                    <MiniDonutChart
                        size={60}
                        centerLabel={`${percentage}%`}
                        data={chartData}
                    />
                </Stack>

                <Typography
                    sx={{
                        minWidth: 0,
                        fontSize: { xs: 26, sm: 29 },
                        lineHeight: 1.15,
                        fontWeight: 700,
                        letterSpacing: "-0.7px",
                        color: "var(--color-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {formatNumber(value)}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {isTotal
                        ? `${percentage}% tổng phản hồi`
                        : `${formatNumber(value)} trên ${formatNumber(total)} phản hồi`}
                </Typography>
            </Stack>
        </Card>
    );
}

export default function FeedbackSummary({ data }: FeedbackSummaryProps) {
    const total = data.total;

    const values = {
        total,
        new: data.new,
        inProgress: data.inProgress,
        resolved: data.resolved,
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.25, sm: 1.5 },
                width: "100%",
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {SUMMARY_ITEMS.map((item) => {
                const value = values[item.key];

                const chartData =
                    item.key === "total"
                        ? getTotalSegments(data)
                        : getStatusSegments(
                              item.label,
                              value,
                              total,
                              item.color,
                          );

                return (
                    <SummaryCard
                        key={item.key}
                        item={item}
                        value={value}
                        total={total}
                        chartData={chartData}
                    />
                );
            })}
        </Box>
    );
}
