"use client";

import { Box } from "@mui/material";
import { useId } from "react";

type DonutSegment = {
    name: string;
    value: number;
    color: string;
    isRemaining?: boolean;
};

type MiniDonutChartProps = {
    data: DonutSegment[];
    centerLabel?: string;
    showTooltip?: boolean;
    size?: number;
};

const TRACK_COLOR = "var(--color-chart-track, #374151)";

const GRADIENT_COLORS: Record<string, string> = {
    "#EF4444": "#F87171",
    "#3B82F6": "#60A5FA",
    "#10B981": "#34D399",
    "#193B56": "#527D9D",
};

export default function MiniDonutChart({
    data,
    centerLabel,
    showTooltip = false,
    size = 84,
}: MiniDonutChartProps) {
    const gradientId = useId().replace(/:/g, "");

    const normalizedData = data
        .filter((item) => item.value > 0)
        .map((item) => ({
            ...item,
            isRemaining:
                item.isRemaining ??
                item.color.startsWith("var(--color-chart-track"),
        }));

    const total = normalizedData.reduce((sum, item) => sum + item.value, 0);

    const activeWidth = 14;
    const trackWidth = 7;
    const radius = 50 - activeWidth / 2 - 1;

    const gap =
        normalizedData.length > 1
            ? Math.min(1.5, 100 / (normalizedData.length * 2))
            : 0;

    const availableLength = Math.max(100 - gap * normalizedData.length, 0);

    const currentOffset = 0;

    const segments = normalizedData.reduce(
        (acc, item, index) => {
            const percentage =
                total > 0 ? (item.value / total) * availableLength : 0;

            const segment = {
                ...item,
                percentage,
                offset: acc.currentOffset,
                gradientId: `${gradientId}-${index}`,
            };

            return {
                segments: [...acc.segments, segment],
                currentOffset: acc.currentOffset + percentage + gap,
            };
        },
        {
            segments: [] as Array<
                (typeof normalizedData)[number] & {
                    percentage: number;
                    offset: number;
                    gradientId: string;
                }
            >,
            currentOffset,
        },
    ).segments;

    const renderSegments = [
        ...segments.filter((item) => item.isRemaining),
        ...segments.filter((item) => !item.isRemaining),
    ];

    const labelFontSize = size >= 120 ? 14 : size >= 80 ? 11 : 10;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                flexShrink: 0,
                position: "relative",
                pointerEvents: showTooltip ? "auto" : "none",
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                role="img"
                aria-label={
                    centerLabel
                        ? `Feedback chart: ${centerLabel}`
                        : "Feedback distribution chart"
                }
                style={{
                    display: "block",
                    overflow: "visible",
                }}
            >
                <defs>
                    {segments
                        .filter((item) => !item.isRemaining)
                        .map((item) => (
                            <linearGradient
                                key={item.gradientId}
                                id={item.gradientId}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={
                                        GRADIENT_COLORS[item.color] ??
                                        item.color
                                    }
                                />
                                <stop offset="100%" stopColor={item.color} />
                            </linearGradient>
                        ))}
                </defs>

                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={TRACK_COLOR}
                    strokeWidth={trackWidth}
                    fill="none"
                />

                <g transform="rotate(-90 50 50)">
                    {renderSegments.map((segment) => (
                        <circle
                            key={segment.gradientId}
                            cx="50"
                            cy="50"
                            r={radius}
                            pathLength={100}
                            stroke={
                                segment.isRemaining
                                    ? TRACK_COLOR
                                    : `url(#${segment.gradientId})`
                            }
                            strokeWidth={
                                segment.isRemaining ? trackWidth : activeWidth
                            }
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            strokeDasharray={`${segment.percentage} 100`}
                            strokeDashoffset={-segment.offset}
                            style={{
                                transition:
                                    "stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1), stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                        >
                            {showTooltip && (
                                <title>
                                    {segment.name}:{" "}
                                    {segment.value.toLocaleString("vi-VN")}
                                </title>
                            )}
                        </circle>
                    ))}
                </g>
            </svg>

            {centerLabel && (
                <Box
                    component="span"
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        fontSize: labelFontSize,
                        lineHeight: 1,
                        fontWeight: 750,
                        letterSpacing: "-0.3px",
                        color: "var(--color-text-primary, #111827)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {centerLabel}
                </Box>
            )}
        </Box>
    );
}
