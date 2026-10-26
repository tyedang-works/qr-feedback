"use client";

import {
    FEEDBACK_ISSUE_LABEL_MAP,
    isFeedbackIssueOption,
} from "@/lib/feedback/constants";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRef, useState } from "react";

import FeedbackStatusChip from "../common/feedback/FeedbackStatusChip";
import FeedbackDetailPanel from "./FeedbackDetailPanel";
import FeedbackIssueChip from "./FeedbackIssueChip";

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
    const visibleIssues = item.selectedOptions.slice(0, 2);
    const remainingIssues = item.selectedOptions.length - visibleIssues.length;

    return (
        <Stack
            sx={{
                p: 2,
                gap: 1.25,
                textAlign: "left",
                bgcolor: isSelected
                    ? "var(--color-surface-active)"
                    : "transparent",
                borderLeft: isSelected
                    ? "2px solid var(--color-text-secondary)"
                    : "2px solid transparent",
                transition:
                    "background-color 150ms ease, border-color 150ms ease",

                "&:hover": {
                    bgcolor: isSelected
                        ? "var(--color-surface-active)"
                        : "var(--color-surface-hover)",
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
                <Stack
                    sx={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 1,
                    }}
                >
                    <Typography
                        sx={{
                            minWidth: 0,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--color-text-primary, #193B56)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {item.tableName}
                    </Typography>

                    <FeedbackStatusChip status={item.status} />
                </Stack>

                <Typography
                    sx={{
                        flexShrink: 0,
                        fontSize: 11,
                        color: "var(--color-text-secondary, #667085)",
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
                {visibleIssues.map((option) => {
                    if (!isFeedbackIssueOption(option)) {
                        return null;
                    }

                    return (
                        <FeedbackIssueChip
                            key={option}
                            option={option}
                            label={FEEDBACK_ISSUE_LABEL_MAP[option]}
                        />
                    );
                })}

                {remainingIssues > 0 && (
                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "var(--color-text-secondary, #667085)",
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
                    color: item.feedback
                        ? "var(--color-text-primary, #344054)"
                        : "var(--color-text-muted, #98A2B3)",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    fontStyle: !item.feedback ? "italic" : "inherit",
                }}
            >
                {item.feedback || "Khách hàng không để lại nội dung bổ sung."}
            </Typography>

            <Typography
                sx={{
                    fontSize: 12,
                    color: "var(--color-text-secondary, #667085)",
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
                border: "1px solid var(--color-border, #EAECF0)",
                borderRadius: 2,
                bgcolor: "var(--color-surface, #FFFFFF)",
                color: "var(--color-text-primary, #344054)",
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
                    backgroundColor: "var(--color-surface-active)",
                    color: "var(--color-text-secondary)",
                    fontSize: 23,
                }}
            >
                ♡
            </Box>

            <Typography
                sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-text-primary, #344054)",
                }}
            >
                Chưa có phản hồi nào
            </Typography>

            <Typography
                sx={{
                    mt: 0.75,
                    fontSize: 13,
                    color: "var(--color-text-secondary, #667085)",
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

    const detailPanelRef = useRef<HTMLDivElement | null>(null);

    const handleFeedbackSelect = (id: string) => {
        setSelectedId(id);

        if (!window.matchMedia("(min-width: 900px)").matches) {
            return;
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        detailPanelRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
        });
    };

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
                    backgroundColor: "var(--color-surface, #FFFFFF)",
                    overflow: "hidden",

                    boxSizing: "border-box",
                    p: { xs: 2, sm: 2.5 },
                    border: "1px solid var(--color-border, #F0F2F5)",
                    borderRadius: "16px",
                    bgcolor: "var(--color-surface, #FFFFFF)",
                    boxShadow: "var(--shadow-card)",
                }}
            >
                <Box
                    sx={{
                        py: 1.75,
                        borderBottom: "1px solid var(--color-border, #EAECF0)",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--color-text-primary, #193B56)",
                        }}
                    >
                        Danh sách phản hồi
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 12,
                            color: "var(--color-text-secondary, #667085)",
                        }}
                    >
                        Chọn một phản hồi để xem chi tiết.
                    </Typography>
                </Box>

                {data.map((item, index) => {
                    const isSelected = item.id === selectedFeedback?.id;

                    return (
                        <Box key={item.id}>
                            {index > 0 && (
                                <Divider
                                    sx={{
                                        borderColor:
                                            "var(--color-border, #EAECF0)",
                                    }}
                                />
                            )}
                            <Box
                                component="button"
                                type="button"
                                onClick={() => handleFeedbackSelect(item.id)}
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
                    scrollMarginTop: "24px",
                }}
                ref={detailPanelRef}
            >
                {selectedFeedback ? (
                    <FeedbackDetailPanel data={selectedFeedback} />
                ) : (
                    <Card
                        elevation={0}
                        sx={{
                            p: 4,
                            border: "1px solid var(--color-border, #EAECF0)",
                            borderRadius: 2,
                            bgcolor: "var(--color-surface, #FFFFFF)",
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
