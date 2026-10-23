"use client";

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

const PERIODS: FeedbackTrendPeriod[] = [7, 30];
const TREND_CHART_COLOR = "#F79009";
const numberFormatter = new Intl.NumberFormat("vi-VN");

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
    const [period, setPeriod] = useState<FeedbackTrendPeriod>(7);
    const [chartData, setChartData] = useState<FeedbackTrendItem[]>(data);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const displayedData = period === 7 ? data : chartData;

    const handlePeriodChange = (nextPeriod: FeedbackTrendPeriod) => {
        if (nextPeriod === 7) {
            setIsLoading(false);
            setErrorMessage("");
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
            setErrorMessage("");

            try {
                const response = await fetch(
                    `/api/dashboard/feedback-trend?period=${period}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("Không thể tải dữ liệu xu hướng phản hồi.");
                }

                const result: FeedbackTrendResponse = await response.json();

                setChartData(result.data);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setErrorMessage("Không thể tải dữ liệu. Vui lòng thử lại.");
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
                            Xu hướng phản hồi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            Số lượng phản hồi trong {period} ngày gần nhất
                        </Typography>
                    </Box>

                    <Stack
                        role="group"
                        aria-label="Chọn khoảng thời gian"
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
                                    {value} ngày
                                </Button>
                            );
                        })}
                    </Stack>
                </Stack>

                {!isLoading && !errorMessage && displayedData.length > 0 && (
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
                                Tổng phản hồi trong kỳ
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
                                Trung bình mỗi ngày
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
                                {summary.average.toLocaleString("vi-VN", {
                                    maximumFractionDigits: 1,
                                })}
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
                            aria-label="Đang tải dữ liệu"
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
                    ) : errorMessage ? (
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
                                {errorMessage}
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
                                Chưa có dữ liệu phản hồi.
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
                                        `${numberFormatter.format(Number(value ?? 0))} lượt`,
                                        "Số phản hồi",
                                    ]}
                                    labelFormatter={(label) => `Ngày ${label}`}
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
                                    name="Số phản hồi"
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
