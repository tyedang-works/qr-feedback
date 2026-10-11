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

export default function RecentFeedback({ data }: RecentFeedbackProps) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                backgroundColor: "#ffffff",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        Phản hồi gần đây
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 13,
                            color: "#667085",
                        }}
                    >
                        5 phản hồi mới nhất
                    </Typography>
                </Box>

                <Link
                    href="/dashboard/feedback"
                    style={{
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1976d2",
                        textDecoration: "none",
                        fontFamily: "var(--font-momo-trust-sans)",
                    }}
                >
                    Xem tất cả →
                </Link>
            </Box>

            {data.length === 0 ? (
                <Box sx={{ px: 3, pb: 3 }}>
                    <Typography sx={{ fontSize: 14, color: "#667085" }}>
                        Chưa có phản hồi nào.
                    </Typography>
                </Box>
            ) : (
                <Stack>
                    {data.map((item, index) => {
                        const status = STATUS_CONFIG[item.status];
                        const visibleOptions = item.selectedOptions.slice(0, 2);
                        const remainingCount =
                            item.selectedOptions.length - visibleOptions.length;

                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    px: { xs: 2, sm: 2.5 },
                                    py: 1.5,
                                    borderTop:
                                        index === 0
                                            ? "1px solid #eaecf0"
                                            : "1px solid #eaecf0",
                                }}
                            >
                                <Stack sx={{ gap: 1.25 }}>
                                    <Stack
                                        sx={{
                                            flexDirection: {
                                                xs: "column",
                                                sm: "row",
                                            },
                                            alignItems: {
                                                xs: "flex-start",
                                                sm: "center",
                                            },
                                            justifyContent: "space-between",
                                            gap: 1,
                                        }}
                                    >
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: "#193B56",
                                                }}
                                            >
                                                {item.tableName}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.25,
                                                    fontSize: 12,
                                                    color: "#98A2B3",
                                                }}
                                            >
                                                {formatDateTime(item.createdAt)}
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label={status.label}
                                            size="small"
                                            sx={{
                                                height: 26,
                                                borderRadius: 1,
                                                color: status.color,
                                                backgroundColor:
                                                    status.backgroundColor,
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Stack>

                                    {item.selectedOptions.length > 0 && (
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                gap: 0.75,
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
                                                        height: 26,
                                                        borderRadius: 1,
                                                        backgroundColor:
                                                            "#eef4f8",
                                                        color: "#193B56",
                                                        fontSize: 11,
                                                    }}
                                                />
                                            ))}

                                            {remainingCount > 0 && (
                                                <Chip
                                                    label={`+${remainingCount}`}
                                                    size="small"
                                                    sx={{
                                                        height: 26,
                                                        borderRadius: 1,
                                                        backgroundColor:
                                                            "#f2f4f7",
                                                        color: "#667085",
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            )}
                                        </Stack>
                                    )}

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: item.feedback
                                                ? "#475467"
                                                : "#98A2B3",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
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
