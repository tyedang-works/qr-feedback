"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import FeedbackManagementForm from "@/components/feedback/FeedbackManagementForm";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
    isFeedbackIssueOption,
} from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { cardSx } from "@/styles/card.styles";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import FeedbackStatusChip from "../common/feedback/FeedbackStatusChip";
import FeedbackIssueChip from "./FeedbackIssueChip";

type FeedbackDetailPanelProps = {
    data: FeedbackListItem;
};

const ISSUE_TRANSLATION_KEYS: Record<string, string> = {
    food_quality: "foodQuality",
    food_presentation: "foodPresentation",
    service: "serviceIssue",
    space_cleanliness: "spaceCleanliness",
    service_time: "serviceTime",
};

function formatDateTime(value: string, locale: string) {
    return new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value));
}

const sectionTitleSx = {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.5,
    color: "var(--color-text-primary, #111827)",
};

const metadataLabelSx = {
    fontSize: 12,
    lineHeight: 1.5,
    color: "var(--color-text-secondary, #667085)",
};

const dividerSx = {
    borderColor: "var(--color-border, #E5E7EB)",
};

export default function FeedbackDetailPanel({
    data,
}: FeedbackDetailPanelProps) {
    const { t, locale } = useTranslation();

    const numberLocale = locale === "en" ? "en-US" : "vi-VN";

    return (
        <Card elevation={0} sx={{ ...cardSx, p: 0, overflow: "hidden" }}>
            <Stack sx={{ gap: 0 }}>
                <Stack
                    sx={{
                        px: { xs: 2, md: 2.5 },
                        pt: 2.5,
                        pb: 2,
                        gap: 1.5,
                    }}
                >
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                component="h2"
                                sx={{
                                    fontSize: 16,
                                    lineHeight: 1.5,
                                    fontWeight: 650,
                                    color: "var(--color-text-primary, #111827)",
                                }}
                            >
                                {t("dashboard", "feedbackDetails")}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: "var(--color-text-secondary, #667085)",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {t("dashboard", "feedbackId")}: {data.publicId}
                            </Typography>
                        </Box>

                        <FeedbackStatusChip status={data.status} />
                    </Stack>

                    <Divider sx={dividerSx} />

                    <Stack
                        sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            columnGap: 5,
                            rowGap: 1.5,
                        }}
                    >
                        <Box sx={{ minWidth: 80 }}>
                            <Typography sx={metadataLabelSx}>
                                {t("dashboard", "table")}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--color-text-primary, #111827)",
                                }}
                            >
                                {data.tableName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography sx={metadataLabelSx}>
                                {t("dashboard", "submittedAt")}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--color-text-primary, #111827)",
                                }}
                            >
                                {formatDateTime(data.createdAt, numberLocale)}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>

                <Divider sx={dividerSx} />

                <Stack
                    sx={{
                        px: { xs: 2, md: 2.5 },
                        py: 2,
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography component="h3" sx={sectionTitleSx}>
                            {t("dashboard", "customerReportedIssues")}
                        </Typography>

                        {data.selectedOptions.length > 0 ? (
                            <Stack
                                sx={{
                                    mt: 1,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 0.75,
                                }}
                            >
                                {data.selectedOptions.map((option) => {
                                    if (!isFeedbackIssueOption(option)) {
                                        return null;
                                    }

                                    const translationKey =
                                        ISSUE_TRANSLATION_KEYS[option];

                                    return (
                                        <FeedbackIssueChip
                                            key={option}
                                            option={option}
                                            label={
                                                translationKey
                                                    ? t(
                                                          "dashboard",
                                                          translationKey,
                                                      )
                                                    : FEEDBACK_ISSUE_LABEL_MAP[
                                                          option
                                                      ]
                                            }
                                        />
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Typography
                                sx={{
                                    mt: 0.75,
                                    fontSize: 13,
                                    color: "var(--color-text-muted, #98A2B3)",
                                }}
                            >
                                {t("dashboard", "noIssuesSelected")}
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <Typography component="h3" sx={sectionTitleSx}>
                            {t("dashboard", "feedbackContent")}
                        </Typography>

                        <Box
                            sx={{
                                mt: 1,
                                px: 1.5,
                                py: 1.25,
                                minHeight: 52,
                                border: "1px solid var(--color-border)",
                                borderRadius: 1.5,
                                bgcolor: "var(--color-surface-hover)",
                                display: "flex",
                                alignItems: data.feedback
                                    ? "flex-start"
                                    : "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    width: "100%",
                                    fontSize: 13,
                                    lineHeight: 1.7,
                                    color: data.feedback
                                        ? "var(--color-text-primary)"
                                        : "var(--color-text-secondary)",
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "anywhere",
                                    fontStyle: data.feedback
                                        ? "normal"
                                        : "italic",
                                }}
                            >
                                {data.feedback ||
                                    t("dashboard", "noAdditionalFeedback")}
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Typography component="h3" sx={sectionTitleSx}>
                            {t("dashboard", "customerPhone")}
                        </Typography>

                        <Typography
                            component="a"
                            href={`tel:${data.phone}`}
                            sx={{
                                display: "inline-block",
                                mt: 0.5,
                                fontSize: 13,
                                fontWeight: 500,
                                color: "var(--color-text-primary, #111827)",
                                textDecoration: "none",
                                overflowWrap: "anywhere",
                                "&:hover": {
                                    textDecoration: "underline",
                                    textUnderlineOffset: 3,
                                },
                            }}
                        >
                            {data.phone}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={dividerSx} />

                <Stack
                    sx={{
                        px: { xs: 2, md: 2.5 },
                        pt: 2,
                        pb: 2.5,
                        gap: 1.5,
                    }}
                >
                    <Box>
                        <Typography component="h3" sx={sectionTitleSx}>
                            {t("dashboard", "processFeedback")}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 12,
                                lineHeight: 1.6,
                                color: "var(--color-text-secondary, #667085)",
                            }}
                        >
                            {t("dashboard", "updateFeedbackStatusDescription")}
                        </Typography>
                    </Box>

                    <FeedbackManagementForm
                        feedbackPublicId={data.publicId}
                        initialStatus={data.status}
                        initialInternalNote={data.internalNote}
                    />
                </Stack>
            </Stack>
        </Card>
    );
}
