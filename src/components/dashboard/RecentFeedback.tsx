import type { RecentFeedbackItem } from "@/lib/dashboard/types";
import { FEEDBACK_ISSUE_LABEL_MAP } from "@/lib/feedback/constants";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

type RecentFeedbackProps = {
    data: RecentFeedbackItem[];
};

const STATUS_CONFIG = {
    new: {
        label: "Chưa xử lý",
        color: "var(--color-feedback-status-new-text, #9A5B13)",
        backgroundColor: "var(--color-feedback-status-new-bg, #F8F0E4)",
    },
    in_progress: {
        label: "Đang xử lý",
        color: "var(--color-feedback-status-progress-text, #526B83)",
        backgroundColor: "var(--color-feedback-status-progress-bg, #EDF1F5)",
    },
    resolved: {
        label: "Đã giải quyết",
        color: "var(--color-feedback-status-resolved-text, #39745C)",
        backgroundColor: "var(--color-feedback-status-resolved-bg, #EAF2ED)",
    },
} as const;

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

function getIssueLabel(option: string) {
    return FEEDBACK_ISSUE_LABEL_MAP[option] ?? option;
}

const ISSUE_CHIP_SX = {
    maxWidth: "100%",
    height: 25,
    borderRadius: "6px",
    border: "1px solid var(--color-border)",
    bgcolor: "var(--color-surface-hover)",
    color: "var(--color-text-secondary)",
    fontSize: 10.5,
    fontWeight: 500,
    transition:
        "background-color 150ms ease, color 150ms ease, border-color 150ms ease",

    "& .MuiChip-label": {
        px: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    "&:hover": {
        bgcolor: "var(--color-surface-active)",
    },

    '[data-theme="light"] .feedback-item:hover &': {
        bgcolor: "#FFFFFF",
        color: "#344054",
        borderColor: "#CBD5E1",
    },

    '[data-theme="dark"] .feedback-item:hover &': {
        bgcolor: "#293548",
        color: "#E5E7EB",
        borderColor: "#64748B",
    },
} as const;

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
                                            {visibleOptions.map((option) => (
                                                <Chip
                                                    key={option}
                                                    label={getIssueLabel(
                                                        option,
                                                    )}
                                                    size="small"
                                                    sx={ISSUE_CHIP_SX}
                                                />
                                            ))}

                                            {remainingCount > 0 && (
                                                <Chip
                                                    label={`+${remainingCount}`}
                                                    size="small"
                                                    sx={{
                                                        height: 25,
                                                        borderRadius: "6px",
                                                        bgcolor:
                                                            "var(--color-surface-active)",
                                                        color: "var(--color-text-secondary)",
                                                        border: "1px solid var(--color-border)",
                                                        fontSize: 10.5,
                                                        fontWeight: 700,
                                                        "& .MuiChip-label": {
                                                            px: 0.875,
                                                        },
                                                    }}
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
