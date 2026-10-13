"use client";

import {
    FEEDBACK_ISSUE_LABEL_MAP,
    FEEDBACK_STATUS,
    type FeedbackStatus,
} from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

import FeedbackDetailPanel from "./FeedbackDetailPanel";

type FeedbackListProps = {
    data: FeedbackListItem[];
};

const STATUS_CONFIG: Record<
    FeedbackStatus,
    { label: string; color: string; backgroundColor: string }
> = {
    [FEEDBACK_STATUS.NEW]: {
        label: "Mới",
        color: "#B54708",
        backgroundColor: "#FFFAEB",
    },
    [FEEDBACK_STATUS.IN_PROGRESS]: {
        label: "Đang xử lý",
        color: "#175CD3",
        backgroundColor: "#EFF8FF",
    },
    [FEEDBACK_STATUS.RESOLVED]: {
        label: "Đã xử lý",
        color: "#027A48",
        backgroundColor: "#ECFDF3",
    },
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
    const month = parts.find((part) => part.type === "month")?.value ?? "";
    const hour = parts.find((part) => part.type === "hour")?.value ?? "";
    const minute = parts.find((part) => part.type === "minute")?.value ?? "";

    return `${day}/${month} • ${hour}:${minute}`;
}

function FeedbackRowContent({
    item,
    isSelected,
}: {
    item: FeedbackListItem;
    isSelected: boolean;
}) {
    const status = STATUS_CONFIG[item.status];
    const visibleIssues = item.selectedOptions.slice(0, 2);
    const remainingIssues = item.selectedOptions.length - visibleIssues.length;

    return (
        <Stack
            sx={{
                p: 2,
                gap: 1.25,
                textAlign: "left",
                backgroundColor: isSelected ? "#F0F6FA" : "#FFFFFF",
                borderLeft: isSelected
                    ? "3px solid #193B56"
                    : "3px solid transparent",
                transition: "background-color 0.2s ease",
                "&:hover": {
                    backgroundColor: "#F8FAFC",
                },
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Typography
                    sx={{
                        minWidth: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#193B56",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {item.tableName}
                </Typography>

                <Typography
                    sx={{
                        flexShrink: 0,
                        fontSize: 11,
                        color: "#667085",
                    }}
                >
                    {formatDateTime(item.createdAt)}
                </Typography>
            </Stack>

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.75,
                }}
            >
                <Chip
                    label={status.label}
                    size="small"
                    sx={{
                        height: 23,
                        borderRadius: 1,
                        color: status.color,
                        backgroundColor: status.backgroundColor,
                        fontSize: 11,
                        fontWeight: 600,
                        "& .MuiChip-label": {
                            px: 1,
                        },
                    }}
                />

                {visibleIssues.map((option) => (
                    <Chip
                        key={option}
                        label={FEEDBACK_ISSUE_LABEL_MAP[option] ?? option}
                        size="small"
                        variant="outlined"
                        sx={{
                            maxWidth: "100%",
                            height: 23,
                            borderColor: "#EAECF0",
                            borderRadius: 1,
                            color: "#475467",
                            fontSize: 11,
                            "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                        }}
                    />
                ))}

                {remainingIssues > 0 && (
                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "#667085",
                        }}
                    >
                        +{remainingIssues}
                    </Typography>
                )}
            </Stack>

            <Typography
                sx={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: item.feedback ? "#475467" : "#98A2B3",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                }}
            >
                {item.feedback || "Khách hàng không để lại nội dung bổ sung."}
            </Typography>

            <Typography
                sx={{
                    fontSize: 12,
                    color: "#667085",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                SĐT: {item.phone}
            </Typography>
        </Stack>
    );
}

function EmptyFeedbackState() {
    return (
        <Card
            elevation={0}
            sx={{
                py: 7,
                px: 3,
                border: "1px solid #EAECF0",
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "#F2F4F7",
                    color: "#667085",
                    fontSize: 23,
                }}
            >
                ♡
            </Box>

            <Typography
                sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#344054",
                }}
            >
                Chưa có phản hồi nào
            </Typography>

            <Typography
                sx={{
                    mt: 0.75,
                    fontSize: 13,
                    color: "#667085",
                }}
            >
                Phản hồi từ khách hàng sẽ xuất hiện tại đây.
            </Typography>
        </Card>
    );
}

export default function FeedbackList({ data }: FeedbackListProps) {
    const [selectedId, setSelectedId] = useState<string | null>(
        data[0]?.id ?? null,
    );

    const selectedFeedback =
        data.find((item) => item.id === selectedId) ?? data[0] ?? null;

    if (data.length === 0) {
        return <EmptyFeedbackState />;
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
                },
                alignItems: "start",
                gap: { xs: 1.5, md: 2 },
                width: "100%",
            }}
        >
            <Card
                elevation={0}
                sx={{
                    minWidth: 0,
                    border: "1px solid #EAECF0",
                    borderRadius: 2,
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom: "1px solid #EAECF0",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        Danh sách phản hồi
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 12,
                            color: "#667085",
                        }}
                    >
                        Chọn một phản hồi để xem chi tiết.
                    </Typography>
                </Box>

                {data.map((item, index) => {
                    const isSelected = item.id === selectedFeedback?.id;

                    return (
                        <Box key={item.id}>
                            {index > 0 && <Divider />}
                            <Box
                                component="button"
                                type="button"
                                onClick={() => setSelectedId(item.id)}
                                aria-pressed={isSelected}
                                sx={{
                                    display: {
                                        xs: "none",
                                        md: "block",
                                    },
                                    width: "100%",
                                    p: 0,
                                    border: 0,
                                    background: "transparent",
                                    cursor: "pointer",
                                    font: "inherit",
                                    textAlign: "left",
                                }}
                            >
                                <FeedbackRowContent
                                    item={item}
                                    isSelected={isSelected}
                                />
                            </Box>

                            <Box
                                component={Link}
                                href={`/dashboard/feedback/${item.publicId}`}
                                sx={{
                                    display: {
                                        xs: "block",
                                        md: "none",
                                    },
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                <FeedbackRowContent
                                    item={item}
                                    isSelected={false}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Card>

            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },
                    minWidth: 0,
                }}
            >
                {selectedFeedback ? (
                    <FeedbackDetailPanel data={selectedFeedback} />
                ) : (
                    <Card
                        elevation={0}
                        sx={{
                            p: 4,
                            border: "1px solid #EAECF0",
                            borderRadius: 2,
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 13, color: "#667085" }}>
                            Chọn một phản hồi để xem chi tiết.
                        </Typography>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
