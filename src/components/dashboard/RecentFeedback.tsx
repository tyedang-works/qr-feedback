"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { RecentFeedbackItem } from "@/lib/dashboard/types";
import { STATUS_CONFIG } from "@/lib/feedback/constants";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

type RecentFeedbackProps = {
    data: RecentFeedbackItem[];
};

type FeedbackStatusTranslationKey = "new" | "inProgress" | "resolved";

function formatRelativeTime(dateString: string, locale: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    const diff = date.getTime() - Date.now();
    const absDiff = Math.abs(diff);

    const units: {
        unit: Intl.RelativeTimeFormatUnit;
        milliseconds: number;
    }[] = [
        { unit: "second", milliseconds: 1000 },
        { unit: "minute", milliseconds: 60 * 1000 },
        { unit: "hour", milliseconds: 60 * 60 * 1000 },
        { unit: "day", milliseconds: 24 * 60 * 60 * 1000 },
        { unit: "week", milliseconds: 7 * 24 * 60 * 60 * 1000 },
        { unit: "month", milliseconds: 30 * 24 * 60 * 60 * 1000 },
        { unit: "year", milliseconds: 365 * 24 * 60 * 60 * 1000 },
    ];

    let selectedUnit = units[0];

    for (let i = 1; i < units.length; i++) {
        if (absDiff >= units[i].milliseconds) {
            selectedUnit = units[i];
        } else {
            break;
        }
    }

    const value =
        Math.sign(diff) * Math.floor(absDiff / selectedUnit.milliseconds);

    return new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style: "long",
    }).format(value, selectedUnit.unit);
}

function getStatusTranslationKey(
    status: string,
): FeedbackStatusTranslationKey | null {
    switch (status) {
        case "new":
            return "new";
        case "in_progress":
            return "inProgress";
        case "resolved":
            return "resolved";
        default:
            return null;
    }
}

export default function RecentFeedback({ data }: RecentFeedbackProps) {
    const { t } = useTranslation();
    const dateLocale = t("dashboard", "dateLocale");

    return (
        <Card
            elevation={0}
            sx={{
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 1.75,
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
                            marginTop: "6px",
                            marginBottom: "2px",
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {t("dashboard", "recentFeedbackTitle")}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: 12,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {t("dashboard", "latestFeedbackCount").replace(
                            "{count}",
                            String(data.length),
                        )}
                    </Typography>
                </Box>

                <Link
                    href="/dashboard/feedback"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                        color: "var(--color-text-primary)",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                        fontFamily: "var(--font-momo-trust-sans)",
                    }}
                >
                    {t("dashboard", "viewAll")}
                    <span aria-hidden="true">→</span>
                </Link>
            </Stack>

            {data.length === 0 ? (
                <Box
                    sx={{
                        px: 2.5,
                        py: 5,
                        borderTop: "1px dashed var(--color-border)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {t("dashboard", "noRecentFeedback")}
                    </Typography>
                </Box>
            ) : (
                <Stack>
                    {data.map((item) => {
                        const status = STATUS_CONFIG[item.status];

                        const statusTranslationKey = getStatusTranslationKey(
                            item.status,
                        );

                        const hasComment = Boolean(item.feedback?.trim());

                        const comment = hasComment
                            ? item.feedback.trim()
                            : t("dashboard", "noAdditionalComment");

                        const relativeTime = formatRelativeTime(
                            item.createdAt,
                            dateLocale,
                        );

                        return (
                            <Box
                                key={item.id}
                                className="feedback-item"
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "34px minmax(0, 1fr) auto",
                                        sm: "34px minmax(180px, 1.15fr) minmax(0, 2fr) minmax(85px, auto)",
                                    },
                                    gridTemplateAreas: {
                                        xs: `
                                            "icon details time"
                                            "icon comment comment"
                                        `,
                                        sm: `
                                            "icon details comment time"
                                        `,
                                    },
                                    alignItems: "center",
                                    columnGap: {
                                        xs: 1.25,
                                        sm: 2,
                                        md: 2.5,
                                    },
                                    rowGap: {
                                        xs: 0.75,
                                        sm: 0,
                                    },
                                    px: { xs: 2, sm: 2.5 },
                                    py: { xs: 1.75, sm: 2 },
                                    borderTop: "1px dashed var(--color-border)",
                                    transition: "background-color 160ms ease",
                                }}
                            >
                                <Box
                                    aria-hidden="true"
                                    sx={{
                                        gridArea: "icon",
                                        width: 36,
                                        height: 36,
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        bgcolor: "var(--color-surface-hover)",
                                        border: "1px solid var(--color-border)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="/assets/table-icon.svg"
                                        alt=""
                                        draggable={false}
                                        sx={{
                                            display: "block",
                                            width: 23,
                                            height: 23,
                                            objectFit: "contain",
                                            opacity: 0.85,
                                            pointerEvents: "none",
                                            userSelect: "none",
                                            transition:
                                                "filter 200ms ease, opacity 200ms ease",

                                            // Dark mode
                                            '[data-theme="dark"] &': {
                                                filter: "brightness(0) invert(1)",
                                                opacity: 0.95,
                                            },
                                        }}
                                    />
                                </Box>
                                <Stack
                                    sx={{
                                        gridArea: "details",
                                        minWidth: 0,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: 0.75,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 12.5,
                                            lineHeight: 1.5,
                                            fontWeight: 650,
                                            color: "var(--color-text-primary)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.tableName}
                                    </Typography>

                                    <Chip
                                        label={
                                            statusTranslationKey
                                                ? t(
                                                      "dashboard",
                                                      statusTranslationKey,
                                                  )
                                                : status.label
                                        }
                                        size="small"
                                        sx={{
                                            height: 21,
                                            borderRadius: "6px",
                                            flexShrink: 0,
                                            color: status.color,
                                            bgcolor: status.backgroundColor,
                                            border: "1px solid transparent",
                                            fontSize: 9.5,
                                            fontWeight: 600,

                                            "& .MuiChip-label": {
                                                px: 0.875,
                                            },
                                        }}
                                    />
                                </Stack>

                                <Box
                                    sx={{
                                        gridArea: "comment",
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        title={comment}
                                        sx={{
                                            display: "block",
                                            minWidth: 0,
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                            color: hasComment
                                                ? "var(--color-text-primary)"
                                                : "var(--color-text-secondary)",
                                            fontStyle: hasComment
                                                ? "normal"
                                                : "italic",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {comment}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        gridArea: "time",
                                        minWidth: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Typography
                                        title={new Intl.DateTimeFormat(
                                            dateLocale,
                                            {
                                                timeZone: "Asia/Ho_Chi_Minh",
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            },
                                        ).format(new Date(item.createdAt))}
                                        sx={{
                                            fontSize: 10.5,
                                            lineHeight: 1.5,
                                            whiteSpace: "nowrap",
                                            color: "var(--color-text-muted)",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {relativeTime}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Card>
    );
}
