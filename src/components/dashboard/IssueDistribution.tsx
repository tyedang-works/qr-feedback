"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import {
    FEEDBACK_ISSUES,
    type FeedbackIssueOption,
} from "@/lib/feedback/constants";
import type {
    IssueComparisonPeriod,
    IssueComparisonResult,
    IssueWeeklyComparisonItem,
} from "@/lib/dashboard/types";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    MenuItem,
    Popover,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState, type MouseEvent } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import QRSelect from "../common/input/QRSelect";

type IssueDistributionProps = {
    data: IssueWeeklyComparisonItem[];
};

type IssueDistributionErrorKey = "comparisonLoadError" | "retryLoadError";

const ISSUE_TRANSLATION_KEYS: Record<
    FeedbackIssueOption,
    | "foodQuality"
    | "foodPresentation"
    | "serviceIssue"
    | "spaceCleanliness"
    | "serviceTime"
> = {
    food_quality: "foodQuality",
    food_presentation: "foodPresentation",
    service: "serviceIssue",
    space_cleanliness: "spaceCleanliness",
    service_time: "serviceTime",
};

const CURRENT_COLOR = "var(--color-chart-current)";
const PREVIOUS_COLOR = "var(--color-chart-previous)";

const currentDate = new Date();

const chartTickStyle = {
    fontSize: 11,
    fill: "var(--color-text-secondary)",
    fontFamily: "var(--font-momo-trust-sans), sans-serif",
};

const periodButtonSx = (selected: boolean) => ({
    px: 1.5,
    py: 0.75,
    border: "1px solid",
    borderColor: selected ? "var(--color-text-primary)" : "var(--color-border)",
    borderRadius: 1.5,
    bgcolor: selected ? "var(--color-text-primary)" : "transparent",
    color: selected ? "var(--color-background)" : "var(--color-text-secondary)",
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: 600,
    textTransform: "none",
    whiteSpace: "nowrap",
    boxShadow: "none",
    "&:hover": {
        bgcolor: selected
            ? "var(--color-text-primary)"
            : "var(--color-surface-hover)",
        borderColor: selected
            ? "var(--color-text-primary)"
            : "var(--color-input-border-hover)",
        boxShadow: "none",
    },
    "&.Mui-focusVisible": {
        outline: "2px solid var(--color-input-focus)",
        outlineOffset: 2,
    },
});

const YEAR_OPTIONS = Array.from(
    { length: currentDate.getFullYear() - 2023 + 1 },
    (_, index) => currentDate.getFullYear() - index,
);

export default function IssueDistribution({ data }: IssueDistributionProps) {
    const { t } = useTranslation();
    const dateLocale = t("dashboard", "dateLocale");
    const numberFormatter = new Intl.NumberFormat(dateLocale);

    const monthOptions = Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: new Intl.DateTimeFormat(dateLocale, {
            month: "long",
            timeZone: "UTC",
        }).format(new Date(Date.UTC(2020, index, 1))),
    }));

    const [period, setPeriod] = useState<IssueComparisonPeriod>("week");

    const [appliedMonth, setAppliedMonth] = useState(
        currentDate.getMonth() + 1,
    );
    const [appliedYear, setAppliedYear] = useState(currentDate.getFullYear());

    const [selectedMonth, setSelectedMonth] = useState(
        currentDate.getMonth() + 1,
    );
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const [periodAnchor, setPeriodAnchor] = useState<HTMLElement | null>(null);

    const isPeriodPopoverOpen = Boolean(periodAnchor);

    const [result, setResult] = useState<IssueComparisonResult>({
        period: "week",
        currentLabel: t("dashboard", "currentPeriod"),
        previousLabel: t("dashboard", "previousPeriod"),
        data,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] =
        useState<IssueDistributionErrorKey | null>(null);

    const handleOpenPeriodPopover = (event: MouseEvent<HTMLElement>) => {
        setSelectedMonth(appliedMonth);
        setSelectedYear(appliedYear);
        setPeriodAnchor(event.currentTarget);
    };

    const handleClosePeriodPopover = () => {
        setPeriodAnchor(null);
    };

    const handleApplyPeriod = () => {
        setAppliedMonth(selectedMonth);
        setAppliedYear(selectedYear);
        setPeriod("month");
        setPeriodAnchor(null);
    };

    const handleSelectWeek = () => {
        setIsLoading(false);
        setErrorMessage(null);
        setPeriod("week");
        setPeriodAnchor(null);
    };

    useEffect(() => {
        if (period === "week") {
            return;
        }

        const controller = new AbortController();

        async function fetchComparison() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const params = new URLSearchParams({
                    period,
                    year: String(appliedYear),
                    month: String(appliedMonth),
                });

                const response = await fetch(
                    `/api/dashboard/issue-comparison?${params.toString()}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    setErrorMessage("comparisonLoadError");
                    return;
                }

                const nextResult: IssueComparisonResult = await response.json();

                setResult(nextResult);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setErrorMessage("retryLoadError");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void fetchComparison();

        return () => controller.abort();
    }, [period, appliedMonth, appliedYear]);

    const sourceChartData = period === "week" ? data : result.data;

    const chartData = sourceChartData.map((item) => {
        // Prefer the stable option when the API provides it.
        // Fall back to the existing Vietnamese label for compatibility.
        const option =
            "option" in item &&
            typeof item.option === "string" &&
            item.option in ISSUE_TRANSLATION_KEYS
                ? (item.option as FeedbackIssueOption)
                : FEEDBACK_ISSUES.find((issue) => issue.label === item.label)
                      ?.option;

        return {
            ...item,
            label: option
                ? t("dashboard", ISSUE_TRANSLATION_KEYS[option])
                : item.label,
        };
    });

    const displayedResult: IssueComparisonResult =
        period === "week"
            ? {
                  period: "week",
                  currentLabel: t("dashboard", "currentPeriod"),
                  previousLabel: t("dashboard", "previousPeriod"),
                  data,
              }
            : result;

    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px solid var(--color-border, #F0F2F5)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
                minWidth: 0,
                height: "fit-content",
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        md: "flex-start",
                    },
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
                        {t("dashboard", "issueDistributionTitle")}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: "var(--color-text-secondary, #6B7280)",
                        }}
                    >
                        {t("dashboard", "issueDistributionDescription")}
                    </Typography>
                </Box>

                <Stack
                    sx={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1,
                    }}
                >
                    <Button
                        size="small"
                        aria-pressed={period === "week"}
                        onClick={handleSelectWeek}
                        sx={periodButtonSx(period === "week")}
                    >
                        {t("dashboard", "weekly")}
                    </Button>

                    <Button
                        size="small"
                        aria-pressed={period === "month" || isPeriodPopoverOpen}
                        aria-haspopup="dialog"
                        aria-expanded={isPeriodPopoverOpen}
                        onClick={handleOpenPeriodPopover}
                        sx={periodButtonSx(
                            period === "month" || isPeriodPopoverOpen,
                        )}
                    >
                        {t("dashboard", "monthly")}
                    </Button>

                    <Popover
                        open={isPeriodPopoverOpen}
                        anchorEl={periodAnchor}
                        onClose={handleClosePeriodPopover}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    width: {
                                        xs: "calc(100vw - 32px)",
                                        sm: 350,
                                    },
                                    maxWidth: 350,
                                    p: 2.5,
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 2,
                                    bgcolor: "var(--color-surface)",
                                    color: "var(--color-text-primary)",
                                    boxShadow: "var(--shadow-card)",
                                },
                            },
                        }}
                    >
                        <Stack sx={{ gap: 2 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {t("dashboard", "selectTime")}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 12,
                                        lineHeight: 1.6,
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    {t("dashboard", "compareMonthDescription")}
                                </Typography>
                            </Box>

                            <Stack
                                sx={{
                                    gap: 1.5,
                                    flexDirection: "row",
                                    width: "100%",
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <QRSelect
                                        fullWidth
                                        label={t("dashboard", "month")}
                                        size="small"
                                        value={selectedMonth}
                                        onChange={(event) =>
                                            setSelectedMonth(
                                                Number(event.target.value),
                                            )
                                        }
                                        inputProps={{
                                            "aria-label": t(
                                                "dashboard",
                                                "selectMonth",
                                            ),
                                        }}
                                    >
                                        {monthOptions.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                                sx={{
                                                    fontSize: 13,
                                                    bgcolor:
                                                        "var(--color-surface)",
                                                    color: "var(--color-text-primary)",
                                                }}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </QRSelect>
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <QRSelect
                                        fullWidth
                                        size="small"
                                        label={t("dashboard", "year")}
                                        value={selectedYear}
                                        onChange={(event) =>
                                            setSelectedYear(
                                                Number(event.target.value),
                                            )
                                        }
                                        inputProps={{
                                            "aria-label": t(
                                                "dashboard",
                                                "selectYear",
                                            ),
                                        }}
                                    >
                                        {YEAR_OPTIONS.map((year) => (
                                            <MenuItem
                                                key={year}
                                                value={year}
                                                sx={{
                                                    fontSize: 13,
                                                    bgcolor:
                                                        "var(--color-surface)",
                                                    color: "var(--color-text-primary)",
                                                }}
                                            >
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </QRSelect>
                                </Box>
                            </Stack>

                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    gap: 1,
                                    pt: 0.5,
                                }}
                            >
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={handleClosePeriodPopover}
                                    sx={buttonBaseCancelSx}
                                >
                                    {t("dashboard", "cancel")}
                                </Button>

                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleApplyPeriod}
                                    sx={buttonBaseSx}
                                >
                                    {t("dashboard", "apply")}
                                </Button>
                            </Stack>
                        </Stack>
                    </Popover>
                </Stack>
            </Stack>

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2.5,
                    mt: 2.5,
                    mb: 1,
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 0.75,
                    }}
                >
                    <Box
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            bgcolor: CURRENT_COLOR,
                            flexShrink: 0,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {displayedResult.currentLabel}
                    </Typography>
                </Stack>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 0.75,
                    }}
                >
                    <Box
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            bgcolor: PREVIOUS_COLOR,
                            flexShrink: 0,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {displayedResult.previousLabel}
                    </Typography>
                </Stack>
            </Stack>

            {isLoading ? (
                <Box
                    role="status"
                    sx={{
                        minHeight: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size={28} sx={{ color: CURRENT_COLOR }} />
                </Box>
            ) : errorMessage ? (
                <Box
                    role="alert"
                    sx={{
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "var(--color-feedback-status-new-text, #B42318)",
                        }}
                    >
                        {t("dashboard", errorMessage)}
                    </Typography>
                </Box>
            ) : chartData.length === 0 ? (
                <Box
                    sx={{
                        minHeight: 180,
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
                        {t("dashboard", "noIssueData")}
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        mt: 1,
                        width: "100%",
                        height: {
                            xs: Math.max(240, chartData.length * 58),
                            sm: Math.max(260, chartData.length * 58),
                        },
                        minWidth: 0,
                        "& .recharts-wrapper, & .recharts-surface": {
                            outline: "none",
                        },
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            accessibilityLayer={false}
                            barCategoryGap="22%"
                            barGap={4}
                            margin={{
                                top: 4,
                                right: 12,
                                left: 4,
                                bottom: 4,
                            }}
                        >
                            <CartesianGrid
                                stroke="var(--color-chart-track)"
                                strokeDasharray="3 3"
                                horizontal={false}
                            />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                                domain={[0, "auto"]}
                                tick={chartTickStyle}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />

                            <YAxis
                                type="category"
                                dataKey="label"
                                width={155}
                                interval={0}
                                tick={chartTickStyle}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "var(--color-surface-hover)",
                                }}
                                isAnimationActive={false}
                                formatter={(value, name) => [
                                    `${numberFormatter.format(
                                        Number(value ?? 0),
                                    )} ${t("dashboard", "feedbackUnit")}`,
                                    name === "currentCount"
                                        ? displayedResult.currentLabel
                                        : displayedResult.previousLabel,
                                ]}
                                contentStyle={{
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 10,
                                    fontSize: 12,
                                    fontFamily:
                                        "var(--font-momo-trust-sans), sans-serif",
                                    backgroundColor: "var(--color-surface)",
                                    color: "var(--color-text-primary)",
                                    boxShadow: "var(--shadow-card)",
                                }}
                                labelStyle={{
                                    color: "var(--color-text-primary)",
                                    fontWeight: 600,
                                    marginBottom: 6,
                                }}
                            />

                            <Bar
                                dataKey="currentCount"
                                name="currentCount"
                                fill={CURRENT_COLOR}
                                radius={[0, 4, 4, 0]}
                                maxBarSize={14}
                                isAnimationActive={false}
                            />

                            <Bar
                                dataKey="previousCount"
                                name="previousCount"
                                fill={PREVIOUS_COLOR}
                                stroke="var(--color-chart-previous-border, #75a99f)"
                                strokeWidth={0.75}
                                radius={[0, 4, 4, 0]}
                                maxBarSize={14}
                                isAnimationActive={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Card>
    );
}
