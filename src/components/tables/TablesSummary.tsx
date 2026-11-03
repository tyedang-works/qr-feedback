"use client";

import { useId } from "react";
import { Box, Card, Stack, Typography } from "@mui/material";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { RestaurantTableSummary } from "@/lib/tables/queries";
import { cardSx } from "@/styles/card.styles";

type TablesSummaryProps = {
    data: RestaurantTableSummary;
};

const STATUS_COLORS = {
    active: "#039855",
    inactive: "#EA580C",
};

const RING_CONFIG = {
    active: {
        radius: 44,
        width: 9,
        color: STATUS_COLORS.active,
        gradientStart: "#34D399",
    },
    inactive: {
        radius: 31,
        width: 8,
        color: STATUS_COLORS.inactive,
        gradientStart: "#FDBA74",
    },
};

function formatNumber(value: number, locale: string): string {
    return value.toLocaleString(locale === "en" ? "en-US" : "vi-VN");
}

function getPercentage(value: number, total: number): number {
    if (total <= 0) return 0;

    return Math.round((value / total) * 100);
}

type RadialRingProps = {
    radius: number;
    width: number;
    percentage: number;
    color: string;
    gradientStart: string;
    gradientId: string;
};

function RadialRing({
    radius,
    width,
    percentage,
    gradientId,
}: RadialRingProps) {
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(percentage, 0), 100);

    return (
        <g transform="rotate(-90 60 60)">
            <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-chart-track, #E5E7EB)"
                strokeWidth={width}
            />

            {progress > 0 && (
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={width}
                    strokeLinecap="round"
                    strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
                    strokeDashoffset={0}
                    style={{
                        transition:
                            "stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                />
            )}
        </g>
    );
}

function TablesRadialChart({
    total,
    activePercentage,
    inactivePercentage,
    locale,
}: {
    total: number;
    activePercentage: number;
    inactivePercentage: number;
    locale: string;
}) {
    const id = useId().replace(/:/g, "");
    const activeGradientId = `${id}-active`;
    const inactiveGradientId = `${id}-inactive`;

    return (
        <Box
            sx={{
                position: "relative",
                width: { xs: 164, sm: 184 },
                height: { xs: 164, sm: 184 },
                flexShrink: 0,
            }}
        >
            <svg viewBox="0 0 120 120" width="100%" height="100%" role="img">
                <defs>
                    <linearGradient
                        id={activeGradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor={RING_CONFIG.active.gradientStart}
                        />
                        <stop
                            offset="100%"
                            stopColor={RING_CONFIG.active.color}
                        />
                    </linearGradient>

                    <linearGradient
                        id={inactiveGradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor={RING_CONFIG.inactive.gradientStart}
                        />
                        <stop
                            offset="100%"
                            stopColor={RING_CONFIG.inactive.color}
                        />
                    </linearGradient>
                </defs>

                <RadialRing
                    radius={RING_CONFIG.active.radius}
                    width={RING_CONFIG.active.width}
                    percentage={activePercentage}
                    color={RING_CONFIG.active.color}
                    gradientStart={RING_CONFIG.active.gradientStart}
                    gradientId={activeGradientId}
                />

                <RadialRing
                    radius={RING_CONFIG.inactive.radius}
                    width={RING_CONFIG.inactive.width}
                    percentage={inactivePercentage}
                    color={RING_CONFIG.inactive.color}
                    gradientStart={RING_CONFIG.inactive.gradientStart}
                    gradientId={inactiveGradientId}
                />
            </svg>

            <Stack
                sx={{
                    position: "absolute",
                    inset: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    gap: 0.25,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 11,
                        lineHeight: 1.2,
                        fontWeight: 500,
                        color: "var(--color-text-secondary)",
                        textAlign: "center",
                        paddingTop: "2px",
                    }}
                >
                    {locale === "en" ? "Total tables" : "Tổng số bàn"}
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 24, sm: 28 },
                        lineHeight: 1.2,
                        fontWeight: 750,
                        letterSpacing: "-0.8px",
                        color: "var(--color-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {formatNumber(total, locale)}
                </Typography>
            </Stack>
        </Box>
    );
}

type StatusLegendProps = {
    label: string;
    value: number;
    percentage: number;
    color: string;
    locale: string;
};

function StatusLegend({
    label,
    value,
    percentage,
    color,
    locale,
}: StatusLegendProps) {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1.25,
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: color,
                    boxShadow: `0 0 0 3px ${color}18`,
                }}
            />

            <Stack
                sx={{
                    flex: 1,
                    minWidth: 0,
                    gap: 0.25,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.4,
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {formatNumber(value, locale)}{" "}
                    {locale === "en"
                        ? value === 1
                            ? "table"
                            : "tables"
                        : "bàn"}
                </Typography>
            </Stack>

            <Typography
                sx={{
                    flexShrink: 0,
                    fontSize: 14,
                    lineHeight: 1.4,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {percentage}%
            </Typography>
        </Stack>
    );
}

export default function TablesSummary({ data }: TablesSummaryProps) {
    const { t, locale } = useTranslation();

    const total = data.total;
    const activePercentage = getPercentage(data.active, total);
    const inactivePercentage = getPercentage(data.inactive, total);

    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                minWidth: 0,
                p: { xs: 2, sm: 2.5 },
                overflow: "hidden",
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 2.5, sm: 4 },
                    minWidth: 0,
                }}
            >
                <TablesRadialChart
                    total={total}
                    activePercentage={activePercentage}
                    inactivePercentage={inactivePercentage}
                    locale={locale}
                />

                <Stack
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                        flex: 1,
                        maxWidth: { xs: "100%", sm: 320 },
                        justifyContent: "center",
                        gap: 2.5,
                    }}
                >
                    <StatusLegend
                        label={t("table", "activeTables")}
                        value={data.active}
                        percentage={activePercentage}
                        color={STATUS_COLORS.active}
                        locale={locale}
                    />

                    <Box
                        sx={{
                            height: "1px",
                            width: "100%",
                            bgcolor: "var(--color-border)",
                        }}
                    />

                    <StatusLegend
                        label={t("table", "inactiveTables")}
                        value={data.inactive}
                        percentage={inactivePercentage}
                        color={STATUS_COLORS.inactive}
                        locale={locale}
                    />
                </Stack>
            </Stack>
        </Card>
    );
}
