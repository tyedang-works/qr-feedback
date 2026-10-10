"use client";

import FeedbackManagementForm from "@/components/feedback/FeedbackManagementForm";
import { FEEDBACK_ISSUE_LABEL_MAP } from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";

type FeedbackDetailPanelProps = {
    data: FeedbackListItem;
};

const STATUS_CONFIG = {
    new: {
        label: "Chưa xử lý",
        color: "#B54708",
        backgroundColor: "#FFFAEB",
    },
    in_progress: {
        label: "Đang xử lý",
        color: "#175CD3",
        backgroundColor: "#EFF8FF",
    },
    resolved: {
        label: "Đã xử lý",
        color: "#027A48",
        backgroundColor: "#ECFDF3",
    },
} as const;

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value));
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            component="h3"
            sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#193B56",
                lineHeight: 1.5,
            }}
        >
            {children}
        </Typography>
    );
}

export default function FeedbackDetailPanel({
    data,
}: FeedbackDetailPanelProps) {
    const status = STATUS_CONFIG[data.status];

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAECF0",
                borderRadius: 2.5,
                overflow: "hidden",
            }}
        >
            <Stack sx={{ gap: 0 }}>
                {/* Panel header */}
                <Stack
                    sx={{
                        px: { xs: 2, md: 2.5 },
                        py: 2,
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
                                    fontSize: 17,
                                    fontWeight: 700,
                                    color: "#193B56",
                                    lineHeight: 1.4,
                                }}
                            >
                                Chi tiết phản hồi
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 12,
                                    color: "#667085",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                Mã phản hồi: {data.publicId}
                            </Typography>
                        </Box>

                        <Chip
                            label={status.label}
                            size="small"
                            sx={{
                                flexShrink: 0,
                                height: 26,
                                color: status.color,
                                backgroundColor: status.backgroundColor,
                                fontSize: 12,
                                fontWeight: 600,
                                borderRadius: 1.5,
                                "& .MuiChip-label": {
                                    px: 1,
                                },
                            }}
                        />
                    </Stack>

                    <Divider sx={{ borderColor: "#EAECF0" }} />

                    <Stack
                        sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            columnGap: 3,
                            rowGap: 1.5,
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
                                    mt: 0.5,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#344054",
                                }}
                            >
                                {data.tableName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#667085",
                                }}
                            >
                                Thời gian gửi
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#344054",
                                }}
                            >
                                {formatDateTime(data.createdAt)}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>

                <Divider sx={{ borderColor: "#EAECF0" }} />

                {/* Feedback content */}
                <Stack
                    sx={{
                        px: { xs: 2, md: 2.5 },
                        py: 2.5,
                        gap: 2.5,
                    }}
                >
                    <Box>
                        <SectionHeading>
                            Vấn đề khách hàng ghi nhận
                        </SectionHeading>

                        {data.selectedOptions.length > 0 ? (
                            <Stack
                                sx={{
                                    mt: 1.25,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 1,
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
                                        variant="outlined"
                                        sx={{
                                            height: "auto",
                                            minHeight: 28,
                                            maxWidth: "100%",
                                            borderColor: "#D0D5DD",
                                            borderRadius: 1.5,
                                            color: "#475467",
                                            fontSize: 12,
                                            "& .MuiChip-label": {
                                                display: "block",
                                                whiteSpace: "normal",
                                                py: 0.5,
                                            },
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: 13,
                                    color: "#98A2B3",
                                }}
                            >
                                Khách hàng không chọn vấn đề cụ thể.
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <SectionHeading>Nội dung phản hồi</SectionHeading>

                        <Box
                            sx={{
                                mt: 1.25,
                                p: 1.75,
                                backgroundColor: "#F9FAFB",
                                border: "1px solid #EAECF0",
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    lineHeight: 1.8,
                                    color: data.feedback
                                        ? "#344054"
                                        : "#98A2B3",
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {data.feedback ||
                                    "Khách hàng không để lại nội dung bổ sung."}
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <SectionHeading>
                            Số điện thoại khách hàng
                        </SectionHeading>

                        <Typography
                            component="a"
                            href={`tel:${data.phone}`}
                            sx={{
                                display: "inline-block",
                                mt: 1,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#175CD3",
                                textDecoration: "none",
                                overflowWrap: "anywhere",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            {data.phone}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ borderColor: "#EAECF0" }} />

                {/* Feedback management */}
                <Stack
                    sx={{
                        px: { xs: 2, md: 2.5 },
                        py: 2.5,
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            component="h3"
                            sx={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#193B56",
                            }}
                        >
                            Xử lý phản hồi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "#667085",
                            }}
                        >
                            Cập nhật trạng thái và ghi chú nội bộ cho nhân viên.
                        </Typography>
                    </Box>

                    <FeedbackManagementForm
                        feedbackPublicId={data.publicId}
                        initialStatus={data.status}
                        initialInternalNote={data.internalNote}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
