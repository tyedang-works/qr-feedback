"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { FeedbackSummary as FeedbackSummaryData } from "@/lib/feedback/types";
import { cardSx } from "@/styles/card.styles";
import { Box, Card, Stack, Typography } from "@mui/material";
import MiniDonutChart from "../common/charts/MiniDonutChart";
import SummaryCardDecoration from "./SummaryCardDecoration";

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

const STATUS_COLORS = {
    total: "#193B56",
    new: "#EF4444",
    inProgress: "#3B82F6",
    resolved: "#10B981",
};

function formatNumber(value: number, locale: string): string {
    return value.toLocaleString(locale);
}

function getPercentage(value: number, total: number): number {
    if (total <= 0) return 0;

    return Math.round((value / total) * 100);
}

function getTotalSegments(
    data: FeedbackSummaryData,
    labels: {
        new: string;
        inProgress: string;
        resolved: string;
    },
): DonutSegment[] {
    return [
        {
            name: labels.new,
            value: data.new,
            color: STATUS_COLORS.new,
        },
        {
            name: labels.inProgress,
            value: data.inProgress,
            color: STATUS_COLORS.inProgress,
        },
        {
            name: labels.resolved,
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
    remainingLabel: string,
): DonutSegment[] {
    return [
        {
            name: label,
            value,
            color,
        },
        {
            name: remainingLabel,
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
    const { t, locale } = useTranslation();

    const isTotal = item.key === "total";
    const percentage = getPercentage(value, total);

    const numberLocale = locale === "en" ? "en-US" : "vi-VN";
    const formattedValue = formatNumber(value, numberLocale);
    const formattedTotal = formatNumber(total, numberLocale);

    const description = isTotal
        ? t("dashboard", "totalFeedbackPercentage").replace(
              "{percentage}",
              String(percentage),
          )
        : t("dashboard", "feedbackCountOfTotal")
              .replace("{value}", formattedValue)
              .replace("{total}", formattedTotal);

    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                position: "relative",
                overflow: "hidden",
                isolation: "isolate",
                p: { xs: 2, sm: 2.5 },
                background: "var(--color-surface)",
                transition:
                    "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
                "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                    "&:hover": {
                        transform: "none",
                    },
                },
                minHeight: { xs: 170, sm: 190 },
                height: "100%",
            }}
        >
            <SummaryCardDecoration color={item.color} />

            <Stack
                sx={{
                    position: "relative",
                    zIndex: 1,
                    minWidth: 0,
                    minHeight: { xs: 125, sm: 135 },
                    height: "100%",
                    justifyContent: "space-between",
                    gap: 1.5,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                minWidth: 0,
                                fontSize: { xs: "16px", sm: "18px" },
                                lineHeight: 1.45,
                                fontWeight: 650,
                                color: "var(--color-text-primary)",
                            }}
                        >
                            {item.label}
                        </Typography>
                    </Stack>

                    <MiniDonutChart
                        size={76}
                        centerLabel={`${percentage}%`}
                        data={chartData}
                    />
                </Stack>

                <Typography
                    sx={{
                        minWidth: 0,
                        fontSize: { xs: 28, sm: 30, xl: 32 },
                        lineHeight: 1.15,
                        fontWeight: 750,
                        letterSpacing: "-1px",
                        color: "var(--color-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {formattedValue}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 11.5,
                        lineHeight: 1.5,
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                    }}
                >
                    {description}
                </Typography>
            </Stack>
        </Card>
    );
}

export default function FeedbackSummary({ data }: FeedbackSummaryProps) {
    const { t } = useTranslation();
    const total = data.total;

    const labels = {
        new: t("dashboard", "new"),
        inProgress: t("dashboard", "inProgress"),
        resolved: t("dashboard", "resolved"),
    };

    const summaryItems: SummaryItem[] = [
        {
            key: "total",
            label: t("dashboard", "totalFeedback"),
            color: STATUS_COLORS.total,
        },
        {
            key: "new",
            label: labels.new,
            color: STATUS_COLORS.new,
        },
        {
            key: "inProgress",
            label: labels.inProgress,
            color: STATUS_COLORS.inProgress,
        },
        {
            key: "resolved",
            label: labels.resolved,
            color: STATUS_COLORS.resolved,
        },
    ];

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
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.5, sm: 2 },
                width: "100%",
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {summaryItems.map((item) => {
                const value = values[item.key];

                const chartData =
                    item.key === "total"
                        ? getTotalSegments(data, labels)
                        : getStatusSegments(
                              item.label,
                              value,
                              total,
                              item.color,
                              t("dashboard", "remaining"),
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
