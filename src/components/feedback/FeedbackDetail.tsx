import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { FEEDBACK_ISSUE_LABEL_MAP } from "@/lib/feedback/constants";
import type { FeedbackDetail as FeedbackDetailData } from "@/lib/feedback/types";

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

    const day = parts.find((part) => part.type === "day")?.value ?? "";

    const month = parts.find((part) => part.type === "month")?.value ?? "";

    const year = parts.find((part) => part.type === "year")?.value ?? "";

    const hour = parts.find((part) => part.type === "hour")?.value ?? "";

    const minute = parts.find((part) => part.type === "minute")?.value ?? "";

    return `${day}/${month}/${year} • ${hour}:${minute}`;
}

export default function FeedbackDetail({ data }: FeedbackDetailProps) {
    return (
        <Stack
            sx={{
                gap: {
                    xs: 2.5,
                    sm: 3,
                },
                maxWidth: 900,
                mx: "auto",
                width: "100%",
            }}
        >
            {/* Header */}
            <Box>
                <Link
                    href="/dashboard/feedback"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "#667085",
                        fontSize: 13,
                        fontWeight: 500,
                        marginBottom: 12,
                    }}
                >
                    <span
                        style={{
                            fontSize: 18,
                            marginRight: 6,
                            lineHeight: 1,
                        }}
                    >
                        ←
                    </span>
                    Quay lại Feedback
                </Link>

                <Typography
                    sx={{
                        fontSize: {
                            xs: 22,
                            sm: 24,
                        },
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Chi tiết phản hồi
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 14,
                        color: "#667085",
                    }}
                >
                    Thông tin chi tiết phản hồi từ khách hàng.
                </Typography>
            </Box>

            {/* Feedback overview */}
            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #eaecf0",
                    borderRadius: 2,
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                    overflow: "hidden",
                }}
            >
                <Stack
                    sx={{
                        p: {
                            xs: 2,
                            sm: 2.5,
                        },
                        gap: 2.5,
                    }}
                >
                    {/* Meta */}
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
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#667085",
                                }}
                            >
                                Bàn
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#193B56",
                                }}
                            >
                                {data.tableName}
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#667085",
                            }}
                        >
                            {formatDateTime(data.createdAt)}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* Issues */}
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            Vấn đề khách hàng chọn
                        </Typography>

                        {data.selectedOptions.length > 0 ? (
                            <Stack
                                sx={{
                                    mt: 1.25,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 0.75,
                                }}
                            >
                                {data.selectedOptions.map((option) => (
                                    <Chip
                                        key={option}
                                        label={
                                            FEEDBACK_ISSUE_LABEL_MAP[option] ??
                                            option
                                        }
                                        size="small"
                                        sx={{
                                            height: 30,
                                            borderRadius: 1.5,
                                            backgroundColor: "#eef4f8",
                                            color: "#193B56",
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: 13,
                                    color: "#98a2b3",
                                }}
                            >
                                Khách hàng không chọn vấn đề cụ thể.
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>

            {/* Customer message */}
            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #eaecf0",
                    borderRadius: 2,
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 2.5,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#344054",
                        }}
                    >
                        Góp ý của khách hàng
                    </Typography>

                    <Box
                        sx={{
                            mt: 1.25,
                            px: 2,
                            py: 1.75,
                            borderRadius: 1.5,
                            backgroundColor: "#f8fafc",
                            border: "1px solid #eef2f5",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: data.feedback ? "#344054" : "#98a2b3",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {data.feedback ||
                                "Khách hàng không để lại nội dung góp ý."}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Phone */}
                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                        },
                        py: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#667085",
                        }}
                    >
                        Số điện thoại
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#193B56",
                        }}
                    >
                        {data.phone}
                    </Typography>
                </Box>
            </Box>
        </Stack>
    );
}
