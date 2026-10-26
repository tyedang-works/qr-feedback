import type { RecentFeedbackItem } from "@/lib/dashboard/types";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
    isFeedbackIssueOption,
    STATUS_CONFIG,
} from "@/lib/feedback/constants";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import FeedbackIssueChip from "../feedback/FeedbackIssueChip";

type RecentFeedbackProps = {
    data: RecentFeedbackItem[];
};

const chipRemainSx = {
    height: 25,
    borderRadius: "6px",
    bgcolor: "var(--color-remaining-count-bg)",
    color: "var(--color-remaining-count-text)",
    border: "1px solid var(--color-remaining-count-border)",
    fontSize: 10.5,
    fontWeight: 700,
    transition: "background-color 150ms ease, border-color 150ms ease",

    "& .MuiChip-label": {
        px: 0.875,
    },

    ".feedback-card:hover &": {
        bgcolor: "var(--color-remaining-count-hover-bg)",
        borderColor: "var(--color-remaining-count-hover-border)",
    },
};

function formatDateTime(dateString: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).format(new Date(dateString));
}

export default function RecentFeedback({ data }: RecentFeedbackProps) {
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
                            color: "var(--color-text-primary)",
                        }}
                    >
                        Phản hồi gần đây
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: 12,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {data.length} phản hồi mới nhất
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
                    Xem tất cả
                    <span aria-hidden="true">→</span>
                </Link>
            </Stack>

            {data.length === 0 ? (
                <Box
                    sx={{
                        px: 2.5,
                        py: 5,
                        borderTop: "1px solid var(--color-border)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        Chưa có phản hồi nào.
                    </Typography>
                </Box>
            ) : (
                <Stack>
                    {data.map((item) => {
                        const status = STATUS_CONFIG[item.status];
                        const visibleOptions = item.selectedOptions.slice(0, 2);
                        const remainingCount = Math.max(
                            0,
                            item.selectedOptions.length - visibleOptions.length,
                        );

                        return (
                            <Box
                                key={item.id}
                                className="feedback-item"
                                sx={{
                                    px: { xs: 2, sm: 2.5 },
                                    py: 1.5,
                                    borderTop: "1px solid var(--color-border)",
                                    transition:
                                        "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease",

                                    "&:hover": {
                                        bgcolor:
                                            "var(--color-feedback-item-hover-bg)",
                                        borderTopColor:
                                            "var(--color-feedback-item-hover-border)",
                                        boxShadow:
                                            "var(--shadow-feedback-item-hover)",
                                    },
                                }}
                            >
                                <Stack sx={{ gap: 0.75 }}>
                                    <Stack
                                        sx={{
                                            flexDirection: "row",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.25,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Box
                                                aria-hidden="true"
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "9px",
                                                    bgcolor:
                                                        "var(--color-surface-hover)",
                                                    color: "var(--color-text-secondary)",
                                                    fontSize: 17,
                                                }}
                                            >
                                                ▦
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        lineHeight: 1.5,
                                                        fontWeight: 600,
                                                        color: "var(--color-text-primary)",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {item.tableName}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 0.125,
                                                        fontSize: 11,
                                                        lineHeight: 1.5,
                                                        color: "var(--color-text-secondary)",
                                                    }}
                                                >
                                                    {formatDateTime(
                                                        item.createdAt,
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Chip
                                            label={status.label}
                                            size="small"
                                            sx={{
                                                height: 23,
                                                flexShrink: 0,
                                                borderRadius: "6px",
                                                color: status.color,
                                                bgcolor: status.backgroundColor,
                                                border: "1px solid transparent",
                                                fontSize: 10,
                                                fontWeight: 600,
                                                "& .MuiChip-label": {
                                                    px: 1,
                                                },
                                            }}
                                        />
                                    </Stack>

                                    {visibleOptions.length > 0 && (
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                                gap: 0.5,
                                                pl: { xs: 0, sm: "46px" },
                                            }}
                                        >
                                            {visibleOptions.map((option) => {
                                                if (
                                                    !isFeedbackIssueOption(
                                                        option,
                                                    )
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <FeedbackIssueChip
                                                        key={option}
                                                        option={option}
                                                        label={
                                                            FEEDBACK_ISSUE_LABEL_MAP[
                                                                option
                                                            ]
                                                        }
                                                    />
                                                );
                                            })}

                                            {remainingCount > 0 && (
                                                <Chip
                                                    label={`+${remainingCount}`}
                                                    size="small"
                                                    sx={chipRemainSx}
                                                />
                                            )}
                                        </Stack>
                                    )}

                                    <Typography
                                        title={item.feedback || undefined}
                                        sx={{
                                            pl: { xs: 0, sm: "46px" },
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                            color: item.feedback
                                                ? "var(--color-text-secondary)"
                                                : "var(--color-text-muted)",
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            overflow: "hidden",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {item.feedback ||
                                            "Không có góp ý bổ sung"}
                                    </Typography>
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Card>
    );
}
