"use client";

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
    description: string;
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
        description: "Tất cả phản hồi",
        color: "#193B56",
    },
    {
        key: "new",
        label: "Chưa xử lý",
        description: "Cần được tiếp nhận",
        color: "#DC4545",
    },
    {
        key: "inProgress",
        label: "Đang xử lý",
        description: "Đang được giải quyết",
        color: "#2563EB",
    },
    {
        key: "resolved",
        label: "Đã xử lý",
        description: "Đã hoàn tất",
        color: "#039855",
    },
];

const STATUS_COLORS = {
    new: "#DC4545",
    inProgress: "#2563EB",
    resolved: "#039855",
};

const TRACK_COLOR = "#F2F4F7";

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
            name: "Chưa xử lý",
            value: data.new,
            color: STATUS_COLORS.new,
        },
        {
            name: "Đang xử lý",
            value: data.inProgress,
            color: STATUS_COLORS.inProgress,
        },
        {
            name: "Đã xử lý",
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
            color: TRACK_COLOR,
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
                    height: "100%",
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
                            fontSize: { xs: 14, sm: 17 },
                            lineHeight: 1.5,
                            fontWeight: 600,
                            color: "var(--color-text-primary, #193B56)",
                        }}
                    >
                        {item.label}
                    </Typography>

                    <MiniDonutChart
                        size={72}
                        centerLabel={`${percentage}%`}
                        data={chartData}
                    />
                </Stack>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        flexWrap: "wrap",
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
                gap: { xs: 1.25, sm: 2 },
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
