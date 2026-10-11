"use client";

import type { FeedbackTrendItem } from "@/lib/dashboard/types";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
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

export default function FeedbackTrend({ data }: FeedbackTrendProps) {
    const [period, setPeriod] = useState<FeedbackTrendPeriod>(7);
    const [chartData, setChartData] = useState(data);
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

    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px solid #E5E7EB",
                borderRadius: 2.5,
                backgroundColor: "#FFFFFF",
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1.5,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Xu hướng phản hồi
                </Typography>

                <Box sx={{ display: "flex", gap: 0.75 }}>
                    {([7, 30] as const).map((value) => {
                        const isSelected = period === value;

                        return (
                            <Button
                                key={value}
                                size="small"
                                variant={isSelected ? "contained" : "outlined"}
                                onClick={() => setPeriod(value)}
                                disabled={isLoading}
                                sx={{
                                    minWidth: 0,
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    borderRadius: 1.5,
                                    borderColor: "#D0D5DD",
                                    color: isSelected ? "#FFFFFF" : "#475467",
                                    backgroundColor: isSelected
                                        ? "#193B56"
                                        : "#FFFFFF",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#193B56",
                                        backgroundColor: isSelected
                                            ? "#142F45"
                                            : "#F9FAFB",
                                        boxShadow: "none",
                                    },
                                    "&.Mui-disabled": {
                                        borderColor: "#D0D5DD",
                                    },
                                }}
                            >
                                {value} ngày
                            </Button>
                        );
                    })}
                </Box>
            </Box>

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#667085",
                }}
            >
                Số lượng phản hồi trong {period} ngày gần nhất
            </Typography>

            <Box
                sx={{
                    mt: 2,
                    width: "100%",
                    height: 240,
                    position: "relative",
                }}
            >
                {isLoading ? (
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress size={28} sx={{ color: "#193B56" }} />
                    </Box>
                ) : errorMessage ? (
                    <Box
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
                                color: "#D92D20",
                                fontSize: 13,
                                textAlign: "center",
                            }}
                        >
                            {errorMessage}
                        </Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={displayedData}
                            margin={{
                                top: 8,
                                right: 12,
                                left: -16,
                                bottom: 4,
                            }}
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
                                }}
                                tickLine={false}
                                axisLine={false}
                                interval={period === 7 ? 0 : "preserveStartEnd"}
                            />

                            <YAxis
                                allowDecimals={false}
                                width={36}
                                tick={{
                                    fontSize: 11,
                                    fill: "#667085",
                                }}
                                tickLine={false}
                                axisLine={false}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    value ?? 0,
                                    "Số phản hồi",
                                ]}
                                labelFormatter={(label) => `Ngày ${label}`}
                                contentStyle={{
                                    border: "1px solid #EAECF0",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontFamily:
                                        "var(--font-momo-trust-sans), sans-serif",
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Số phản hồi"
                                stroke="#193B56"
                                strokeWidth={2.5}
                                dot={{
                                    r: period === 7 ? 4 : 2,
                                    fill: "#193B56",
                                    strokeWidth: 0,
                                }}
                                activeDot={{
                                    r: 6,
                                    fill: "#193B56",
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
}
