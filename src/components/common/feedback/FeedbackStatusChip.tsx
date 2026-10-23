"use client";

import { FEEDBACK_STATUS } from "@/lib/feedback/constants";
import type { FeedbackStatus } from "@/lib/feedback/constants";
import { Chip } from "@mui/material";

type FeedbackStatusChipProps = {
    status: FeedbackStatus;
};

const STATUS_CONFIG: Record<
    FeedbackStatus,
    {
        label: string;
        color: string;
        backgroundColor: string;
        borderColor: string;
    }
> = {
    [FEEDBACK_STATUS.NEW]: {
        label: "Chưa xử lý",
        color: "var(--color-feedback-status-new-text)",
        backgroundColor: "var(--color-feedback-status-new-bg)",
        borderColor: "var(--color-feedback-status-new-border)",
    },
    [FEEDBACK_STATUS.IN_PROGRESS]: {
        label: "Đang xử lý",
        color: "var(--color-feedback-status-progress-text)",
        backgroundColor: "var(--color-feedback-status-progress-bg)",
        borderColor: "var(--color-feedback-status-progress-border)",
    },
    [FEEDBACK_STATUS.RESOLVED]: {
        label: "Đã giải quyết",
        color: "var(--color-feedback-status-resolved-text)",
        backgroundColor: "var(--color-feedback-status-resolved-bg)",
        borderColor: "var(--color-feedback-status-resolved-border)",
    },
};

export default function FeedbackStatusChip({
    status,
}: FeedbackStatusChipProps) {
    const config = STATUS_CONFIG[status];

    return (
        <Chip
            label={config.label}
            size="small"
            sx={{
                height: 23,
                flexShrink: 0,
                borderRadius: 1,
                color: config.color,
                bgcolor: config.backgroundColor,
                border: "1px solid",
                borderColor: config.borderColor,
                fontSize: 11,
                fontWeight: 600,
                "& .MuiChip-label": {
                    px: 1,
                    lineHeight: 1.4,
                },
            }}
        />
    );
}
