import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";

import FeedbackManagementForm from "@/components/feedback/FeedbackManagementForm";
import { FEEDBACK_ISSUE_LABEL_MAP } from "@/lib/feedback/constants";
import type { FeedbackDetail as FeedbackDetailData } from "@/lib/feedback/types";

type FeedbackDetailProps = {
    data: FeedbackDetailData;
};

const STATUS_CONFIG = {
    new: {
        label: "Mới",
        color: "#175CD3",
        backgroundColor: "#EFF8FF",
    },
    in_progress: {
        label: "Đang xử lý",
        color: "#B54708",
        backgroundColor: "#FFFAEB",
    },
    resolved: {
        label: "Đã xử lý",
        color: "#027A48",
        backgroundColor: "#ECFDF3",
    },
} as const;

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
                backgroundColor: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: 2.5,
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.04)",
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
    title: string;
    description?: string;
}) {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#193B56",
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
                        color: "#667085",
                    }}
                >
                    {description}
                </Typography>
            )}
        </Box>
    );
}

export default function FeedbackDetail({ data }: FeedbackDetailProps) {
    const status = STATUS_CONFIG[data.status];

    return (
        <Stack sx={{ width: "100%", gap: 3 }}>
            {/* Page heading */}
            <Box>
                <Link
                    href="/dashboard/feedback"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 12,
                        color: "#667085",
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: "none",
                    }}
                >
                    <span aria-hidden="true">←</span>
                    Quay lại Feedback
                </Link>

                <Stack
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: { xs: 23, sm: 26 },
                                lineHeight: 1.3,
                                fontWeight: 700,
                                color: "#193B56",
                            }}
                        >
                            Chi tiết phản hồi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: "#667085",
                            }}
                        >
                            Xem nội dung và theo dõi quá trình xử lý phản hồi
                            của khách hàng.
                        </Typography>
                    </Box>

                    <Chip
                        label={status.label}
                        size="small"
                        sx={{
                            height: 30,
                            borderRadius: 1.5,
                            backgroundColor: status.backgroundColor,
                            color: status.color,
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    />
                </Stack>
            </Box>

            {/* Two-column content */}
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
                {/* Left column: customer feedback */}
                <Stack sx={{ minWidth: 0, gap: 2.5 }}>
                    <SectionCard>
                        <Stack sx={{ p: { xs: 2, sm: 2.5 }, gap: 2.5 }}>
                            <SectionHeading
                                title="Thông tin phản hồi"
                                description="Thông tin bàn và thời điểm khách hàng gửi phản hồi."
                            />

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
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #eef2f5",
                                    }}
                                >
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
                                            fontSize: 17,
                                            fontWeight: 700,
                                            color: "#193B56",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {data.tableName}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #eef2f5",
                                    }}
                                >
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
                                            lineHeight: 1.6,
                                            color: "#344054",
                                        }}
                                    >
                                        {formatDateTime(data.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

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
                                            gap: 1,
                                        }}
                                    >
                                        {data.selectedOptions.map((option) => (
                                            <Chip
                                                key={option}
                                                label={
                                                    FEEDBACK_ISSUE_LABEL_MAP[
                                                        option
                                                    ] ?? option
                                                }
                                                size="small"
                                                sx={{
                                                    minHeight: 30,
                                                    height: "auto",
                                                    borderRadius: 1.5,
                                                    backgroundColor: "#eef4f8",
                                                    color: "#193B56",
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    "& .MuiChip-label": {
                                                        py: 0.75,
                                                        whiteSpace: "normal",
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
                                            color: "#98a2b3",
                                        }}
                                    >
                                        Khách hàng không chọn vấn đề cụ thể.
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </SectionCard>

                    <SectionCard>
                        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                            <SectionHeading
                                title="Góp ý của khách hàng"
                                description="Nội dung khách hàng chia sẻ khi gửi phản hồi."
                            />

                            <Box
                                sx={{
                                    mt: 2,
                                    p: { xs: 1.75, sm: 2 },
                                    minHeight: 100,
                                    borderRadius: 2,
                                    backgroundColor: "#f8fafc",
                                    border: "1px solid #eef2f5",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                        color: data.feedback
                                            ? "#344054"
                                            : "#98a2b3",
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {data.feedback ||
                                        "Khách hàng không để lại nội dung góp ý."}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2.5 }} />

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#667085",
                                }}
                            >
                                Số điện thoại liên hệ
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#193B56",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {data.phone}
                            </Typography>
                        </Box>
                    </SectionCard>
                </Stack>

                {/* Right column: feedback management */}
                <Box sx={{ minWidth: 0 }}>
                    <SectionCard>
                        <Box
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                borderBottom: "1px solid #eaecf0",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <SectionHeading
                                title="Xử lý phản hồi"
                                description="Cập nhật trạng thái và lưu ghi chú nội bộ cho nhân viên."
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
