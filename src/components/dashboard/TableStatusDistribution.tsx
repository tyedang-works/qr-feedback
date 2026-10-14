"use client";

import { Box, Card, Stack, Typography } from "@mui/material";
import { LayoutGrid } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type TableStatusDistributionProps = {
    totalTables: number;
    activeTables: number;
};

const ACTIVE_COLOR = "var(--color-primary, #111827)";
const INACTIVE_COLOR = "#D1D5DB";

export default function TableStatusDistribution({
    totalTables,
    activeTables,
}: TableStatusDistributionProps) {
    const safeTotal = Math.max(0, totalTables);
    const safeActive = Math.min(safeTotal, Math.max(0, activeTables));
    const inactiveTables = safeTotal - safeActive;

    const activePercentage = safeTotal > 0 ? (safeActive / safeTotal) * 100 : 0;

    const chartData = [
        {
            name: "Đang hoạt động",
            value: safeActive,
            color: ACTIVE_COLOR,
        },
        {
            name: "Đã tắt",
            value: inactiveTables,
            color: INACTIVE_COLOR,
        },
    ];

    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                minWidth: 0,
                height: "fit-content",
                border: "none",
                borderRadius: 2,
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
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
                        Tình trạng bàn
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 13,
                            lineHeight: 1.5,
                            color: "var(--color-text-secondary, #6B7280)",
                        }}
                    >
                        Phân bổ bàn theo trạng thái hoạt động
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        bgcolor: "#F3F4F6",
                        color: "var(--color-primary, #111827)",
                    }}
                >
                    <LayoutGrid size={21} strokeWidth={1.8} />
                </Box>
            </Stack>

            {safeTotal === 0 ? (
                <Box
                    sx={{
                        height: 190,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--color-text-primary, #111827)",
                        }}
                    >
                        Chưa có bàn
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "var(--color-text-secondary, #6B7280)",
                            textAlign: "center",
                        }}
                    >
                        Thêm bàn để xem thống kê hoạt động.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            mt: 1,
                            width: "100%",
                            height: 190,
                            position: "relative",
                            "& .recharts-wrapper, & .recharts-surface": {
                                outline: "none",
                            },
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="61%"
                                    outerRadius="84%"
                                    paddingAngle={
                                        safeActive > 0 && inactiveTables > 0
                                            ? 3
                                            : 0
                                    }
                                    stroke="none"
                                    isAnimationActive={false}
                                >
                                    {chartData.map((item) => (
                                        <Cell
                                            key={item.name}
                                            fill={item.color}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    cursor={false}
                                    formatter={(value, name) => {
                                        const count = Number(value ?? 0);
                                        const percentage =
                                            safeTotal > 0
                                                ? (
                                                      (count / safeTotal) *
                                                      100
                                                  ).toLocaleString("vi-VN", {
                                                      maximumFractionDigits: 1,
                                                  })
                                                : "0";

                                        return [
                                            `${count.toLocaleString("vi-VN")} bàn (${percentage}%)`,
                                            String(name ?? ""),
                                        ];
                                    }}
                                    contentStyle={{
                                        border: "none",
                                        borderRadius: 10,
                                        backgroundColor: "#FFFFFF",
                                        fontSize: 12,
                                        fontFamily:
                                            "var(--font-momo-trust-sans), sans-serif",
                                        boxShadow:
                                            "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
                                    }}
                                    itemStyle={{
                                        color: "var(--color-primary, #111827)",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: "var(--color-text-secondary, #6B7280)",
                                }}
                            >
                                Tổng số bàn
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: 26,
                                    lineHeight: 1.3,
                                    fontWeight: 700,
                                    letterSpacing: "-0.5px",
                                    color: "var(--color-primary, #111827)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {safeTotal.toLocaleString("vi-VN")}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack sx={{ gap: 2, mt: 1 }}>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: { xs: 1.5, sm: 2.5 },
                            }}
                        >
                            {chartData.map((item) => (
                                <Stack
                                    key={item.name}
                                    sx={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 0.75,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            flexShrink: 0,
                                            borderRadius: "50%",
                                            bgcolor: item.color,
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "var(--color-text-secondary, #6B7280)",
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>

                        <Box
                            sx={{
                                height: 6,
                                width: "100%",
                                overflow: "hidden",
                                display: "flex",
                                borderRadius: "999px",
                                bgcolor: "#E5E7EB",
                            }}
                            role="img"
                            aria-label={`Bàn hoạt động ${activePercentage.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%, bàn đã tắt ${(100 - activePercentage).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`}
                        >
                            <Box
                                sx={{
                                    width: `${activePercentage}%`,
                                    height: "100%",
                                    bgcolor: ACTIVE_COLOR,
                                    transition: "width 200ms ease",
                                }}
                            />
                        </Box>

                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    bgcolor: "#F9FAFB",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "var(--color-text-secondary, #6B7280)",
                                    }}
                                >
                                    Đang hoạt động
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 20,
                                        lineHeight: 1.3,
                                        fontWeight: 700,
                                        color: "var(--color-primary, #111827)",
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {safeActive.toLocaleString("vi-VN")}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: 11,
                                        color: "var(--color-text-secondary, #6B7280)",
                                    }}
                                >
                                    {activePercentage.toLocaleString("vi-VN", {
                                        maximumFractionDigits: 1,
                                    })}
                                    %
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    bgcolor: "#F9FAFB",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "var(--color-text-secondary, #6B7280)",
                                    }}
                                >
                                    Đã tắt
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 20,
                                        lineHeight: 1.3,
                                        fontWeight: 700,
                                        color: "var(--color-primary, #111827)",
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {inactiveTables.toLocaleString("vi-VN")}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: 11,
                                        color: "var(--color-text-secondary, #6B7280)",
                                    }}
                                >
                                    {(100 - activePercentage).toLocaleString(
                                        "vi-VN",
                                        { maximumFractionDigits: 1 },
                                    )}
                                    %
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </>
            )}
        </Card>
    );
}
