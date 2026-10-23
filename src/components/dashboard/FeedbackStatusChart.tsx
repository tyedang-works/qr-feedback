"use client";

import type { FeedbackStatusDistributionItem } from "@/lib/dashboard/types";
import { Box, Card, Stack, Typography } from "@mui/material";

type FeedbackStatusChartProps = {
    data: FeedbackStatusDistributionItem[];
};

const numberFormatter = new Intl.NumberFormat("vi-VN");

const RING_ITEMS: {
    status: FeedbackStatusDistributionItem["status"];
    label: string;
    color: string;
}[] = [
    {
        status: "new",
        label: "Chưa xử lý",
        color: "var(--color-chart-new)",
    },
    {
        status: "in_progress",
        label: "Đang xử lý",
        color: "var(--color-chart-in-progress)",
    },
    {
        status: "resolved",
        label: "Đã giải quyết",
        color: "var(--color-chart-resolved)",
    },
];

const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;
const RING_WIDTH = 18;
const RING_RADII = [104, 78, 52];

function getPercentage(count: number, total: number) {
    return total > 0 ? (count / total) * 100 : 0;
}

function StatusRings({
    data,
    total,
}: {
    data: FeedbackStatusDistributionItem[];
    total: number;
}) {
    const countByStatus = new Map(
        data.map((item) => [item.status, item.count]),
    );

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: 380,
                aspectRatio: "1 / 1",
                mx: "auto",
            }}
        >
            <svg
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                width="100%"
                height="100%"
                role="img"
                aria-label={`Tổng ${numberFormatter.format(total)} phản hồi, phân bố theo ba trạng thái xử lý`}
            >
                {RING_ITEMS.map((item, index) => {
                    const radius = RING_RADII[index];
                    const circumference = 2 * Math.PI * radius;
                    const count = countByStatus.get(item.status) ?? 0;
                    const percentage = getPercentage(count, total);
                    const progress = (percentage / 100) * circumference;

                    return (
                        <g key={item.status}>
                            <circle
                                cx={CENTER}
                                cy={CENTER}
                                r={radius}
                                fill="none"
                                stroke="var(--color-chart-track)"
                                strokeWidth={RING_WIDTH}
                            />

                            {percentage > 0 && (
                                <circle
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={radius}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth={RING_WIDTH}
                                    strokeLinecap="round"
                                    strokeDasharray={`${progress} ${circumference}`}
                                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                                />
                            )}
                        </g>
                    );
                })}
            </svg>

            <Stack
                sx={{
                    position: "absolute",
                    inset: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.25,
                    pointerEvents: "none",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 11,
                        lineHeight: 1.5,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Tổng phản hồi
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 27, sm: 30 },
                        lineHeight: 1.3,
                        fontWeight: 700,
                        letterSpacing: "-0.7px",
                        color: "var(--color-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {numberFormatter.format(total)}
                </Typography>
            </Stack>
        </Box>
    );
}

function StatusLegend({
    data,
    total,
}: {
    data: FeedbackStatusDistributionItem[];
    total: number;
}) {
    const countByStatus = new Map(
        data.map((item) => [item.status, item.count]),
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                columnGap: { xs: 1.5, sm: 2.5 },
                rowGap: 1,
                pt: 2,
                mt: 1,
                borderTop: "1px dashed var(--color-border)",
            }}
        >
            {RING_ITEMS.map((item) => {
                const count = countByStatus.get(item.status) ?? 0;
                const percentage = getPercentage(count, total);

                return (
                    <Stack
                        key={item.status}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.75,
                            minWidth: 0,
                        }}
                    >
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                flexShrink: 0,
                                borderRadius: "50%",
                                bgcolor: item.color,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 12,
                                lineHeight: 1.5,
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            {item.label}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                lineHeight: 1.5,
                                fontWeight: 600,
                                color: "var(--color-text-primary)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {numberFormatter.format(count)}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "var(--color-text-secondary)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {percentage.toLocaleString("vi-VN", {
                                maximumFractionDigits: 1,
                            })}
                            %
                        </Typography>
                    </Stack>
                );
            })}
        </Box>
    );
}

export default function FeedbackStatusChart({
    data,
}: FeedbackStatusChartProps) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                p: { xs: 2, sm: 2.5 },
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
                    gap: 0.5,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        lineHeight: 1.5,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                    }}
                >
                    Trạng thái phản hồi
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Phân bố theo tình trạng xử lý
                </Typography>

                {total === 0 ? (
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 280,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                color: "var(--color-text-secondary)",
                                textAlign: "center",
                            }}
                        >
                            Chưa có dữ liệu phản hồi.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                py: { xs: 1, sm: 1.5 },
                            }}
                        >
                            <StatusRings data={data} total={total} />
                        </Box>

                        <StatusLegend data={data} total={total} />
                    </>
                )}
            </Stack>
        </Card>
    );
}
