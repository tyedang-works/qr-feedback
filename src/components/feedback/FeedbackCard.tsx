"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
    isFeedbackIssueOption,
} from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { Box, Card, CardActionArea, Stack, Typography } from "@mui/material";
import { ArrowUpRight, Phone } from "lucide-react";

import FeedbackStatusChip from "@/components/common/feedback/FeedbackStatusChip";
import FeedbackIssueChip from "./FeedbackIssueChip";
import { cardSx } from "@/styles/card.styles";

type FeedbackCardProps = {
    item: FeedbackListItem;
    onClick: () => void;
};

const ISSUE_TRANSLATION_KEYS: Record<string, string> = {
    food_quality: "foodQuality",
    food_presentation: "foodPresentation",
    service: "serviceIssue",
    space_cleanliness: "spaceCleanliness",
    service_time: "serviceTime",
};

function formatDateTime(dateString: string, locale: string) {
    const parts = new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date(dateString));

    const day = parts.find((part) => part.type === "day")?.value ?? "";
    const month = parts.find((part) => part.type === "month")?.value ?? "";
    const hour = parts.find((part) => part.type === "hour")?.value ?? "";
    const minute = parts.find((part) => part.type === "minute")?.value ?? "";

    return `${day}/${month} • ${hour}:${minute}`;
}

export default function FeedbackCard({ item, onClick }: FeedbackCardProps) {
    const { t, locale } = useTranslation();

    const visibleIssues = item.selectedOptions.slice(0, 2);
    const remainingIssues = item.selectedOptions.length - visibleIssues.length;

    return (
        <Card
            elevation={0}
            sx={{
                ...cardSx,
                height: "100%",
                minWidth: 0,
                p: 0,
                overflow: "hidden",
                transition: "border-color 180ms ease, box-shadow 180ms ease",

                "&:hover": {
                    borderColor: "var(--color-input-border-hover)",
                    boxShadow: "0 4px 12px rgba(145, 158, 171, 0.14)",
                },
            }}
        >
            <CardActionArea
                component="button"
                type="button"
                disableRipple
                onClick={onClick}
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "stretch",
                    textAlign: "left",
                    color: "inherit",
                    borderRadius: "inherit",

                    "&:hover": {
                        bgcolor: "transparent",
                    },

                    "&.Mui-focusVisible": {
                        outline: "2px solid var(--color-input-focus)",
                        outlineOffset: -2,
                    },
                }}
            >
                <Stack
                    sx={{
                        width: "100%",
                        minWidth: 0,
                        p: 2,
                        gap: 1.5,
                        textAlign: "left",
                    }}
                >
                    {/* Header */}
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                minWidth: 0,
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--color-text-primary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {item.tableName}
                        </Typography>

                        <FeedbackStatusChip status={item.status} />
                    </Stack>

                    {/* Submitted date */}
                    <Typography
                        sx={{
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {formatDateTime(
                            item.createdAt,
                            locale === "en" ? "en-US" : "vi-VN",
                        )}
                    </Typography>

                    {/* Issues */}
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 0.75,
                            minHeight: 27,
                        }}
                    >
                        {visibleIssues.map((option) => {
                            if (!isFeedbackIssueOption(option)) {
                                return null;
                            }

                            const translationKey =
                                ISSUE_TRANSLATION_KEYS[option];

                            const label = translationKey
                                ? t("dashboard", translationKey)
                                : FEEDBACK_ISSUE_LABEL_MAP[option];

                            return (
                                <FeedbackIssueChip
                                    key={option}
                                    option={option}
                                    label={label}
                                />
                            );
                        })}

                        {remainingIssues > 0 && (
                            <Box
                                component="span"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 27,
                                    height: 27,
                                    px: 0.75,
                                    borderRadius: "6px",
                                    bgcolor: "var(--color-surface-active)",
                                    color: "var(--color-text-secondary)",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    lineHeight: "27px",
                                }}
                            >
                                +{remainingIssues}
                            </Box>
                        )}

                        {item.selectedOptions.length === 0 && (
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "var(--color-text-muted)",
                                    fontStyle: "italic",
                                }}
                            >
                                {t("dashboard", "noIssuesSelected")}
                            </Typography>
                        )}
                    </Stack>

                    {/* Feedback content */}
                    <Typography
                        sx={{
                            minHeight: 62,
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: item.feedback
                                ? "var(--color-text-primary)"
                                : "var(--color-text-muted)",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            fontStyle: item.feedback ? "normal" : "italic",
                        }}
                    >
                        {item.feedback ||
                            t("dashboard", "noAdditionalFeedback")}
                    </Typography>

                    {/* Footer */}
                    <Box
                        sx={{
                            mt: "auto",
                            pt: 1.5,
                            borderTop: "1px solid var(--color-border)",
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 0.75,
                                    minWidth: 0,
                                }}
                            >
                                <Phone
                                    size={14}
                                    color="var(--color-text-secondary)"
                                    style={{ flexShrink: 0 }}
                                />

                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        fontSize: 12,
                                        color: "var(--color-text-secondary)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {item.phone}
                                </Typography>
                            </Stack>

                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 0.5,
                                    flexShrink: 0,
                                    color: "var(--color-button-primary-bg)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}
                                >
                                    {t("dashboard", "feedbackDetails")}
                                </Typography>

                                <ArrowUpRight size={14} />
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </CardActionArea>
        </Card>
    );
}
