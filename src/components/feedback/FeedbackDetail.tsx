import FeedbackDetailText from "@/components/feedback/FeedbackDetailText";
import FeedbackManagementForm from "@/components/feedback/FeedbackManagementForm";
import { isFeedbackIssueOption } from "@/lib/feedback/constants";
import type { FeedbackDetail as FeedbackDetailData } from "@/lib/feedback/types";
import { cardSx } from "@/styles/card.styles";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import FeedbackStatusChip from "../common/feedback/FeedbackStatusChip";
import FeedbackIssueChipTranslated from "./FeedbackIssueChipTranslated";

type FeedbackDetailProps = {
    data: FeedbackDetailData;
};

function formatDateTime(dateString: string) {
    const parts = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date(dateString));

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return `${getPart("day")}/${getPart("month")}/${getPart("year")} • ${getPart("hour")}:${getPart("minute")}`;
}

function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                ...cardSx,
                p: 0,
                overflow: "hidden",
            }}
        >
            {children}
        </Box>
    );
}

function SectionHeading({
    title,
    description,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
}) {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontWeight: 700,
                    color: "var(--color-text-primary, #111827)",
                }}
            >
                {title}
            </Typography>

            {description && (
                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "var(--color-text-secondary, #667085)",
                    }}
                >
                    {description}
                </Typography>
            )}
        </Box>
    );
}

export default function FeedbackDetail({ data }: FeedbackDetailProps) {
    return (
        <Stack sx={{ width: "100%", gap: { xs: 2.5, md: 3 } }}>
            <Box>
                <Link
                    href="/dashboard/feedback"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 12,
                        color: "var(--color-text-secondary, #667085)",
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: "none",
                    }}
                >
                    <span aria-hidden="true">←</span>
                    <FeedbackDetailText translationKey="backToFeedback" />
                </Link>

                <Stack
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: 18, sm: 22 },
                                lineHeight: 1.3,
                                fontWeight: 600,
                                color: "var(--color-text-primary, #111827)",
                            }}
                        >
                            <FeedbackDetailText translationKey="detailTitle" />
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: "var(--color-text-secondary, #667085)",
                            }}
                        >
                            <FeedbackDetailText translationKey="detailSubtitle" />
                        </Typography>
                    </Box>

                    <FeedbackStatusChip status={data.status} />
                </Stack>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1.35fr) minmax(320px, 0.85fr)",
                    },
                    alignItems: "start",
                    gap: { xs: 2, md: 2.5 },
                }}
            >
                <Stack sx={{ minWidth: 0, gap: { xs: 2, md: 2.5 } }}>
                    <SectionCard>
                        <Stack sx={{ p: { xs: 2, sm: 2.5 }, gap: 2.5 }}>
                            <SectionHeading
                                title={
                                    <FeedbackDetailText translationKey="feedbackInformation" />
                                }
                                description={
                                    <FeedbackDetailText translationKey="feedbackInformationDescription" />
                                }
                            />

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "minmax(0, 1fr)",
                                        sm: "repeat(2, minmax(0, 1fr))",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        minWidth: 0,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "var(--color-surface-hover, #F9FAFB)",
                                        border: "1px solid var(--color-border, #E5E7EB)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "var(--color-text-secondary, #667085)",
                                        }}
                                    >
                                        <FeedbackDetailText translationKey="table" />
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.75,
                                            fontSize: 17,
                                            fontWeight: 700,
                                            lineHeight: 1.5,
                                            color: "var(--color-text-primary, #111827)",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {data.tableName}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        minWidth: 0,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "var(--color-surface-hover, #F9FAFB)",
                                        border: "1px solid var(--color-border, #E5E7EB)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "var(--color-text-secondary, #667085)",
                                        }}
                                    >
                                        <FeedbackDetailText translationKey="submittedAt" />
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.75,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            lineHeight: 1.6,
                                            color: "var(--color-text-primary, #111827)",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {formatDateTime(data.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider
                                sx={{
                                    borderColor: "var(--color-border, #E5E7EB)",
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "var(--color-text-primary, #111827)",
                                    }}
                                >
                                    <FeedbackDetailText translationKey="selectedIssues" />
                                </Typography>

                                {data.selectedOptions.length > 0 ? (
                                    <Stack
                                        sx={{
                                            mt: 1.25,
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}
                                    >
                                        {data.selectedOptions.map((option) => {
                                            if (
                                                !isFeedbackIssueOption(option)
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <FeedbackIssueChipTranslated
                                                    key={option}
                                                    option={option}
                                                />
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontSize: 13,
                                            lineHeight: 1.6,
                                            color: "var(--color-text-muted, #9CA3AF)",
                                        }}
                                    >
                                        <FeedbackDetailText translationKey="noSelectedIssues" />
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </SectionCard>

                    <SectionCard>
                        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <SectionHeading
                                title={
                                    <FeedbackDetailText translationKey="customerFeedback" />
                                }
                                description={
                                    <FeedbackDetailText translationKey="customerFeedbackDescription" />
                                }
                            />

                            <Box
                                sx={{
                                    mt: 2,
                                    p: { xs: 1.75, sm: 2 },
                                    minHeight: 100,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "var(--color-surface-hover, #F9FAFB)",
                                    border: "1px solid var(--color-border, #E5E7EB)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                        color: data.feedback
                                            ? "var(--color-text-primary, #111827)"
                                            : "var(--color-text-muted, #9CA3AF)",
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {data.feedback || (
                                        <FeedbackDetailText translationKey="noFeedbackContent" />
                                    )}
                                </Typography>
                            </Box>

                            <Divider
                                sx={{
                                    my: 2.5,
                                    borderColor: "var(--color-border, #E5E7EB)",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "var(--color-text-secondary, #667085)",
                                }}
                            >
                                <FeedbackDetailText translationKey="contactPhone" />
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.75,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "var(--color-text-primary, #111827)",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {data.phone}
                            </Typography>
                        </Box>
                    </SectionCard>
                </Stack>

                <Box sx={{ minWidth: 0 }}>
                    <SectionCard>
                        <Box
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                borderBottom:
                                    "1px solid var(--color-border, #E5E7EB)",
                                backgroundColor:
                                    "var(--color-surface, #FFFFFF)",
                            }}
                        >
                            <SectionHeading
                                title={
                                    <FeedbackDetailText translationKey="feedbackManagement" />
                                }
                                description={
                                    <FeedbackDetailText translationKey="feedbackManagementDescription" />
                                }
                            />
                        </Box>

                        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <FeedbackManagementForm
                                feedbackPublicId={data.publicId}
                                initialStatus={data.status}
                                initialInternalNote={data.internalNote}
                            />
                        </Box>
                    </SectionCard>
                </Box>
            </Box>
        </Stack>
    );
}
