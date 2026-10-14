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
        color: "#B42318",
        backgroundColor: "#FEF3F2",
    },
    in_progress: {
        label: "Đang xử lý",
        color: "#B54708",
        backgroundColor: "#FFFAEB",
    },
    resolved: {
        label: "Đã giải quyết",
        color: "#027A48",
        backgroundColor: "#ECFDF3",
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

const ISSUE_CHIP_COLORS: Record<
    string,
    { backgroundColor: string; color: string; borderColor: string }
> = {
    food_quality: {
        backgroundColor: "#FEF3F2",
        color: "#B42318",
        borderColor: "#FECDCA",
    },
    food_presentation: {
        backgroundColor: "#F4F3FF",
        color: "#5925DC",
        borderColor: "#D9D6FE",
    },
    service: {
        backgroundColor: "#EFF8FF",
        color: "#175CD3",
        borderColor: "#B2DDFF",
    },
    space_cleanliness: {
        backgroundColor: "#FFF6ED",
        color: "#C4320A",
        borderColor: "#FEDF89",
    },
    service_time: {
        backgroundColor: "#FFFAEB",
        color: "#B54708",
        borderColor: "#FEDF89",
    },
};

const DEFAULT_ISSUE_CHIP_COLOR = {
    backgroundColor: "#F2F4F7",
    color: "#344054",
    borderColor: "#EAECF0",
};

function getIssueChipColor(option: string) {
    return ISSUE_CHIP_COLORS[option] ?? DEFAULT_ISSUE_CHIP_COLOR;
}

export default function RecentFeedback({ data }: RecentFeedbackProps) {
    return (
        <Card
            elevation={0}
            sx={{
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid #EAECF0",
                borderRadius: "16px",
                bgcolor: "#FFFFFF",
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
                            color: "#193B56",
                        }}
                    >
                        Phản hồi gần đây
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: 12,
                            color: "#667085",
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
                        color: "#193B56",
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
                        borderTop: "1px solid #F0F2F5",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#667085",
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
                                sx={{
                                    px: { xs: 2, sm: 2.5 },
                                    py: 1.5,
                                    borderTop: "1px solid #F0F2F5",
                                    transition: "background-color 0.15s",
                                    "&:hover": {
                                        bgcolor: "#FCFCFD",
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
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "9px",
                                                    bgcolor: "#F2F4F7",
                                                    color: "#344054",
                                                    fontSize: 17,
                                                }}
                                                aria-hidden="true"
                                            >
                                                ▦
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        lineHeight: 1.5,
                                                        fontWeight: 600,
                                                        color: "#193B56",
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
                                                        color: "#667085",
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

                                                    sx={{
                                                        maxWidth: "100%",
                                                        height: 25,
                                                        borderRadius: "6px",
                                                        border: "1px solid",
                                                        ...getIssueChipColor(
                                                            option,
                                                        ),
                                                        fontSize: 10.5,
                                                        fontWeight: 500,
                                                        transition:
                                                            "all 0.15s ease",
                                                        "& .MuiChip-label": {
                                                            px: 1,
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        },
                                                        "&:hover": {
                                                            filter: "brightness(0.97)",
                                                        },
                                                    }}
                                                />
                                            ))}

                                            {remainingCount > 0 && (
                                                <Chip
                                                    label={`+${remainingCount}`}
                                                    size="small"

                                                    sx={{
                                                        height: 25,
                                                        borderRadius: "6px",
                                                        bgcolor: "#EAECF0",
                                                        color: "#475467",
                                                        border: "1px solid #D0D5DD",
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
                                                ? "#475467"
                                                : "#98A2B3",
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
