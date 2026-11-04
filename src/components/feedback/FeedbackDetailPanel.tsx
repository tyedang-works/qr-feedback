"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import FeedbackManagementForm from "@/components/feedback/FeedbackManagementForm";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
    FEEDBACK_STATUS,
    isFeedbackIssueOption,
} from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { Box, Divider, Stack, Typography } from "@mui/material";
import FeedbackIssueChip from "./FeedbackIssueChip";

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
    color: "var(--color-text-primary)",
};

const metadataLabelSx = {
    fontSize: 13,
    lineHeight: 1.5,
    color: "var(--color-text-secondary)",
};

const metadataValueSx = {
    mt: 0.5,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.5,
    color: "var(--color-text-primary)",
};

const dividerSx = { borderColor: "var(--color-border)" };

type FeedbackDetailPanelProps = {
    data: FeedbackListItem;
    onClose: () => void;
};

export default function FeedbackDetailPanel({
    data,
    onClose,
}: FeedbackDetailPanelProps) {
    const { t, locale } = useTranslation();

    const numberLocale = locale === "en" ? "en-US" : "vi-VN";
    const isResolved = data.status === FEEDBACK_STATUS.RESOLVED;

    return (
        <Stack sx={{ gap: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(3, minmax(0, 1fr))",
                    },
                    alignItems: "center",
                    gap: { xs: 2, sm: 0 },
                    p: { xs: 2, sm: 2.5 },
                    border: "1px solid var(--color-border)",
                    borderRadius: 2,
                    bgcolor: "var(--color-surface)",
                    boxShadow: "var(--shadow-card)",
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={metadataLabelSx}>
                        {t("dashboard", "table")}
                    </Typography>

                    <Typography
                        sx={{
                            ...metadataValueSx,
                            fontSize: 15,
                            fontWeight: 700,
                            letterSpacing: "-0.2px",
                        }}
                    >
                        {data.tableName}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        minWidth: 0,
                        pl: { xs: 0, sm: 2 },
                        borderLeft: {
                            xs: "none",
                            sm: "1px solid var(--color-border)",
                        },
                    }}
                >
                    <Typography sx={metadataLabelSx}>
                        {t("dashboard", "submittedAt")}
                    </Typography>

                    <Typography
                        sx={{
                            ...metadataValueSx,
                            overflowWrap: "anywhere",
                        }}
                    >
                        {formatDateTime(data.createdAt, numberLocale)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        minWidth: 0,
                        gridColumn: {
                            xs: "1 / -1",
                            sm: "auto",
                        },
                        pl: { xs: 0, sm: 2 },
                        borderLeft: {
                            xs: "none",
                            sm: "1px solid var(--color-border)",
                        },
                    }}
                >
                    <Typography sx={metadataLabelSx}>
                        {t("dashboard", "customerPhone")}
                    </Typography>

                    <Typography
                        component="a"
                        href={`tel:${data.phone}`}
                        sx={{
                            ...metadataValueSx,
                            display: "inline-block",
                            overflowWrap: "anywhere",
                            textDecoration: "none",
                            transition: "color 180ms ease",
                            "&:hover": {
                                color: "var(--color-button-primary-bg)",
                                textDecoration: "underline",
                                textUnderlineOffset: 3,
                            },
                        }}
                    >
                        {data.phone}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={dividerSx} />

            <Stack sx={{ gap: 2 }}>
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
                                                ? t("dashboard", translationKey)
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
                                color: "var(--color-text-muted)",
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
                            alignItems: data.feedback ? "flex-start" : "center",
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
                                fontStyle: data.feedback ? "normal" : "italic",
                            }}
                        >
                            {data.feedback ||
                                t("dashboard", "noAdditionalFeedback")}
                        </Typography>
                    </Box>
                </Box>
            </Stack>

            <Divider sx={dividerSx} />

            <Box>
                <Stack sx={{ gap: 2 }}>
                    <Typography component="h3" sx={sectionTitleSx}>
                        {t("dashboard", "processFeedback")}
                    </Typography>

                    {isResolved ? (
                        <>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, minmax(0, 1fr))",
                                    },
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography sx={metadataLabelSx}>
                                        {t("feedback", "resolvedBy")}
                                    </Typography>

                                    <Typography sx={metadataValueSx}>
                                        {data.resolvedByName || "—"}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography sx={metadataLabelSx}>
                                        {t("feedback", "resolvedAt")}
                                    </Typography>

                                    <Typography sx={metadataValueSx}>
                                        {data.resolvedAt
                                            ? formatDateTime(
                                                  data.resolvedAt,
                                                  numberLocale,
                                              )
                                            : "—"}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={dividerSx} />

                            <Box>
                                <Typography sx={sectionTitleSx}>
                                    {t("dashboard", "internalNote")}
                                </Typography>

                                <Box
                                    sx={{
                                        mt: 1,
                                        pl: 2,
                                        py: 0.5,
                                        borderLeft:
                                            "3px solid var(--color-button-primary-bg)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            lineHeight: 1.7,
                                            color: data.internalNote
                                                ? "var(--color-text-primary)"
                                                : "var(--color-text-muted)",
                                            whiteSpace: "pre-wrap",
                                            overflowWrap: "anywhere",
                                            fontStyle: data.internalNote
                                                ? "normal"
                                                : "italic",
                                        }}
                                    >
                                        {data.internalNote || "—"}
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    lineHeight: 1.6,
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                {t(
                                    "dashboard",
                                    "updateFeedbackStatusDescription",
                                )}
                            </Typography>

                            <FeedbackManagementForm
                                feedbackPublicId={data.publicId}
                                initialStatus={data.status}
                                initialInternalNote={data.internalNote}
                                onSuccess={onClose}
                            />
                        </>
                    )}
                </Stack>
            </Box>
        </Stack>
    );
}
