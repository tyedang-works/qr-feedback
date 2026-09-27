import {
    FEEDBACK_ISSUE_LABEL_MAP,
} from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import {
    Box,
    Card,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

type FeedbackListProps = {
    data: FeedbackListItem[];
};

function formatDateTime(dateString: string) {
    const parts = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date(dateString));

    const day = parts.find((part) => part.type === "day")?.value ?? "";
    const month =
        parts.find((part) => part.type === "month")?.value ?? "";
    const hour =
        parts.find((part) => part.type === "hour")?.value ?? "";
    const minute =
        parts.find((part) => part.type === "minute")?.value ?? "";

    return `${day}/${month} • ${hour}:${minute}`;
}

function getIssueLabel(option: string) {
    return (
        FEEDBACK_ISSUE_LABEL_MAP[option] ??
        option
    );
}

export default function FeedbackList({
    data,
}: FeedbackListProps) {
    if (data.length === 0) {
        return (
            <Card
                elevation={0}
                sx={{
                    p: 4,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    textAlign: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 14,
                        color: "#667085",
                    }}
                >
                    Chưa có phản hồi nào.
                </Typography>
            </Card>
        );
    }

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
            {data.map((item, index) => (
                <Box key={item.id}>
                    {index > 0 && <Divider />}

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 2.5,
                            },
                        }}
                    >
                        <Stack sx={{ gap: 2 }}>
                            {/* Header */}
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
                                    justifyContent:
                                        "space-between",
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: "#193B56",
                                    }}
                                >
                                    {item.tableName}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#98A2B3",
                                    }}
                                >
                                    {formatDateTime(
                                        item.createdAt,
                                    )}
                                </Typography>
                            </Stack>

                            {/* Issues */}
                            {item.selectedOptions.length >
                                0 && (
                                    <Stack sx={{ gap: 1 }}>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: "#667085",
                                            }}
                                        >
                                            Vấn đề khách hàng chọn
                                        </Typography>

                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                gap: 0.75,
                                            }}
                                        >
                                            {item.selectedOptions.map(
                                                (option) => (
                                                    <Chip
                                                        key={option}
                                                        label={getIssueLabel(
                                                            option,
                                                        )}
                                                        size="small"
                                                        sx={{
                                                            height: 28,
                                                            borderRadius: 1,
                                                            backgroundColor:
                                                                "#eef4f8",
                                                            color: "#193B56",
                                                            fontSize: 11,
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </Stack>
                                    </Stack>
                                )}

                            {/* Feedback */}
                            {item.feedback && (
                                <Stack sx={{ gap: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "#667085",
                                        }}
                                    >
                                        Góp ý của khách hàng
                                    </Typography>

                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: 1.5,
                                            backgroundColor: "#f8fafc",
                                            border:
                                                "1px solid #eef2f5",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                color: "#344054",
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {item.feedback}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}

                            {/* Phone */}
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#667085",
                                    }}
                                >
                                    Số điện thoại:
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#344054",
                                    }}
                                >
                                    {item.phone}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            ))}
        </Card>
    );
}