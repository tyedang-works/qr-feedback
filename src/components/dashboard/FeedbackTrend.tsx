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

export default function FeedbackTrend({ data }: FeedbackTrendProps) {
    const [period, setPeriod] = useState<FeedbackTrendPeriod>(7);
    const [chartData, setChartData] = useState<FeedbackTrendItem[]>(data);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const displayedData = period === 7 ? data : chartData;

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
                                color: "var(--color-text-primary, #111827)",
                            }}
                        >
                            Xu hướng phản hồi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "var(--color-text-secondary, #6B7280)",
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
                            const isSelected = period === value;

                            return (
                                <Button
                                    key={value}
                                    size="small"
                                    variant="text"
                                    aria-pressed={isSelected}
                                    onClick={() => setPeriod(value)}
                                    disabled={isLoading}
                                    sx={{
                                        minWidth: 76,
                                        px: 1.5,
                                        py: 0.625,
                                        border: "1px solid",
                                        borderColor: isSelected
                                            ? "var(--color-primary, #111827)"
                                            : "var(--color-border, #E5E7EB)",
                                        borderRadius: 1.5,
                                        bgcolor: isSelected
                                            ? "var(--color-primary, #111827)"
                                            : "transparent",
                                        color: isSelected
                                            ? "#FFFFFF"
                                            : "var(--color-text-secondary, #6B7280)",
                                        fontSize: 12,
                                        lineHeight: 1.4,
                                        fontWeight: isSelected ? 600 : 500,
                                        textTransform: "none",
                                        whiteSpace: "nowrap",
                                        boxShadow: "none",
                                        "&:hover": {
                                            bgcolor: isSelected
                                                ? "var(--color-primary, #111827)"
                                                : "var(--color-surface-hover, #F9FAFB)",
                                            borderColor: isSelected
                                                ? "var(--color-primary, #111827)"
                                                : "var(--color-border, #E5E7EB)",
                                            boxShadow: "none",
                                        },
                                        "&.Mui-disabled": {
                                            opacity: 1,
                                            color: isSelected
                                                ? "#FFFFFF"
                                                : "var(--color-text-secondary, #6B7280)",
                                            bgcolor: isSelected
                                                ? "var(--color-primary, #111827)"
                                                : "transparent",
                                        },
                                        "&.Mui-focusVisible": {
                                            outline: "2px solid #9CA3AF",
                                            outlineOffset: 2,
                                        },
                                    }}
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
                                    color: "var(--color-text-secondary, #6B7280)",
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
                                    color: "var(--color-text-primary, #111827)",
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
                                    color: "var(--color-text-secondary, #6B7280)",
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
                                    color: "var(--color-text-primary, #111827)",
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
                        "& .recharts-wrapper": {
                            outline: "none",
                        },
                        "& .recharts-surface": {
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
                                    color: "#00A878",
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
                                    color: "#B42318",
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
                                    color: "var(--color-text-secondary, #6B7280)",
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
                                    stroke="#EAECF0"
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="label"
                                    tick={{
                                        fontSize: 11,
                                        fill: "#667085",
                                        fontFamily:
                                            "var(--font-momo-trust-sans), sans-serif",
                                    }}
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
                                    tick={{
                                        fontSize: 11,
                                        fill: "#667085",
                                        fontFamily:
                                            "var(--font-momo-trust-sans), sans-serif",
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(0, 168, 120, 0.06)",
                                    }}
                                    formatter={(value) => [
                                        `${numberFormatter.format(Number(value ?? 0))} lượt`,
                                        "Số phản hồi",
                                    ]}
                                    labelFormatter={(label) => `Ngày ${label}`}
                                    contentStyle={{
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 10,
                                        backgroundColor: "#FFFFFF",
                                        fontSize: 12,
                                        fontFamily:
                                            "var(--font-momo-trust-sans), sans-serif",
                                        boxShadow:
                                            "0 4px 12px rgba(17, 24, 39, 0.08)",
                                    }}
                                    labelStyle={{
                                        color: "#6B7280",
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
