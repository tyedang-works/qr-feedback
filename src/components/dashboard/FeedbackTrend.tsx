"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { FeedbackTrendItem } from "@/lib/dashboard/types";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type FeedbackTrendProps = {
    data: FeedbackTrendItem[];
};

type FeedbackTrendPeriod = 7 | 30;

type FeedbackTrendResponse = {
    data: FeedbackTrendItem[];
};

type FeedbackTrendErrorKey = "trendLoadError" | "retryLoadError";

const PERIODS: FeedbackTrendPeriod[] = [7, 30];
const TREND_CHART_COLOR = "#F79009";
const numberFormatter = new Intl.NumberFormat("vi-VN");
const averageFormatter = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
});

const chartTickStyle = {
    fontSize: 11,
    fill: "var(--color-text-secondary)",
    fontFamily: "var(--font-momo-trust-sans), sans-serif",
};

const periodButtonSx = (selected: boolean) => ({
    minWidth: 76,
    px: 1.5,
    py: 0.625,
    border: "1px solid",
    borderColor: selected ? "var(--color-text-primary)" : "var(--color-border)",
    borderRadius: 1.5,
    bgcolor: selected ? "var(--color-text-primary)" : "transparent",
    color: selected ? "var(--color-background)" : "var(--color-text-secondary)",
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: selected ? 600 : 500,
    textTransform: "none",
    whiteSpace: "nowrap",
    boxShadow: "none",
    transition:
        "background-color 150ms ease, color 150ms ease, border-color 150ms ease",

    "&:hover": {
        bgcolor: selected
            ? "var(--color-text-primary)"
            : "var(--color-surface-hover)",
        borderColor: selected
            ? "var(--color-text-primary)"
            : "var(--color-input-border-hover)",
        boxShadow: "none",
    },

    "&.Mui-disabled": {
        opacity: 1,
        color: selected
            ? "var(--color-background)"
            : "var(--color-text-secondary)",
        bgcolor: selected ? "var(--color-text-primary)" : "transparent",
        borderColor: selected
            ? "var(--color-text-primary)"
            : "var(--color-border)",
    },

    "&.Mui-focusVisible": {
        outline: "2px solid var(--color-input-focus)",
        outlineOffset: 2,
    },
});

export default function FeedbackTrend({ data }: FeedbackTrendProps) {
    const { t } = useTranslation();

    const [period, setPeriod] = useState<FeedbackTrendPeriod>(7);
    const [chartData, setChartData] = useState<FeedbackTrendItem[]>(data);
    const [isLoading, setIsLoading] = useState(false);
    const [errorKey, setErrorKey] = useState<FeedbackTrendErrorKey | null>(
        null,
    );

    const displayedData = period === 7 ? data : chartData;

    const handlePeriodChange = (nextPeriod: FeedbackTrendPeriod) => {
        if (nextPeriod === period) {
            return;
        }

        if (nextPeriod === 7) {
            setIsLoading(false);
            setErrorKey(null);
        }

        setPeriod(nextPeriod);
    };

    useEffect(() => {
        if (period === 7) {
            return;
        }

        const controller = new AbortController();

        async function fetchFeedbackTrend() {
            setIsLoading(true);
            setErrorKey(null);

            try {
                const response = await fetch(
                    `/api/dashboard/feedback-trend?period=${period}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    setErrorKey("trendLoadError");
                    return;
                }

                const result: FeedbackTrendResponse = await response.json();

                if (!Array.isArray(result.data)) {
                    setErrorKey("retryLoadError");
                    return;
                }

                setChartData(result.data);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setErrorKey("retryLoadError");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void fetchFeedbackTrend();

        return () => {
            controller.abort();
        };
    }, [period]);

    const summary = useMemo(() => {
        const total = displayedData.reduce((sum, item) => sum + item.count, 0);

        return {
            total,
            average:
                displayedData.length > 0 ? total / displayedData.length : 0,
        };
    }, [displayedData]);

    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                minWidth: 0,
                height: "100%",
                boxSizing: "border-box",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    gap: 2,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "stretch",
                            sm: "flex-start",
                        },
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: 16,
                                lineHeight: 1.5,
                                fontWeight: 700,
                                color: "var(--color-text-primary)",
                            }}
                        >
                            {t("dashboard", "trendTitle")}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            {t("dashboard", "trendDescription").replace(
                                "{days}",
                                String(period),
                            )}
                        </Typography>
                    </Box>

                    <Stack
                        role="group"
                        aria-label={t("dashboard", "selectPeriod")}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.75,
                            flexShrink: 0,
                        }}
                    >
                        {PERIODS.map((value) => {
                            const selected = period === value;

                            return (
                                <Button
                                    key={value}
                                    type="button"
                                    size="small"
                                    variant="text"
                                    aria-pressed={selected}
                                    onClick={() => handlePeriodChange(value)}
                                    disabled={isLoading}
                                    sx={periodButtonSx(selected)}
                                >
                                    {t("dashboard", "days").replace(
                                        "{days}",
                                        String(value),
                                    )}
                                </Button>
                            );
                        })}
                    </Stack>
                </Stack>

                {!isLoading && !errorKey && displayedData.length > 0 && (
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: { xs: 3, sm: 4 },
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                {t("dashboard", "totalFeedbackInPeriod")}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 21,
                                    lineHeight: 1.4,
                                    fontWeight: 700,
                                    letterSpacing: "-0.4px",
                                    color: "var(--color-text-primary)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {numberFormatter.format(summary.total)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                {t("dashboard", "dailyAverage")}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 21,
                                    lineHeight: 1.4,
                                    fontWeight: 700,
                                    letterSpacing: "-0.4px",
                                    color: "var(--color-text-primary)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {averageFormatter.format(summary.average)}
                            </Typography>
                        </Box>
                    </Stack>
                )}

                <Box
                    sx={{
                        mt: 0.5,
                        width: "100%",
                        height: { xs: 240, sm: 290 },
                        minWidth: 0,
                        position: "relative",
                        "& .recharts-wrapper, & .recharts-surface": {
                            outline: "none",
                        },
                    }}
                >
                    {isLoading ? (
                        <Box
                            role="status"
                            aria-label={t("dashboard", "loadingData")}
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress
                                size={28}
                                sx={{
                                    color: "var(--color-text-secondary)",
                                }}
                            />
                        </Box>
                    ) : errorKey ? (
                        <Box
                            role="alert"
                            sx={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    textAlign: "center",
                                    color: "var(--color-feedback-error, #B42318)",
                                }}
                            >
                                {t("dashboard", errorKey)}
                            </Typography>
                        </Box>
                    ) : displayedData.length === 0 ? (
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                {t("dashboard", "noFeedbackData")}
                            </Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={displayedData}
                                margin={{
                                    top: 8,
                                    right: 8,
                                    left: -16,
                                    bottom: 4,
                                }}
                                barCategoryGap="38%"
                            >
                                <CartesianGrid
                                    stroke="var(--color-chart-track)"
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="label"
                                    tick={chartTickStyle}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={
                                        period === 7 ? 0 : "preserveStartEnd"
                                    }
                                    tickMargin={10}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    domain={[0, "auto"]}
                                    width={36}
                                    tick={chartTickStyle}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "var(--color-surface-hover)",
                                    }}
                                    formatter={(value) => [
                                        `${numberFormatter.format(
                                            Number(value ?? 0),
                                        )} ${t("dashboard", "submissions")}`,
                                        t("dashboard", "feedbackCount"),
                                    ]}
                                    labelFormatter={(label) =>
                                        t("dashboard", "day").replace(
                                            "{day}",
                                            String(label),
                                        )
                                    }
                                    contentStyle={{
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 10,
                                        backgroundColor: "var(--color-surface)",
                                        color: "var(--color-text-primary)",
                                        fontSize: 12,
                                        fontFamily:
                                            "var(--font-momo-trust-sans), sans-serif",
                                        boxShadow: "var(--shadow-card)",
                                    }}
                                    labelStyle={{
                                        color: "var(--color-text-secondary)",
                                        marginBottom: 4,
                                    }}
                                    itemStyle={{
                                        color: TREND_CHART_COLOR,
                                        fontWeight: 600,
                                    }}
                                />

                                <Bar
                                    dataKey="count"
                                    name={t("dashboard", "feedbackCount")}
                                    fill={TREND_CHART_COLOR}
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={period === 7 ? 32 : 20}
                                    isAnimationActive={false}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Box>
            </Stack>
        </Card>
    );
}
