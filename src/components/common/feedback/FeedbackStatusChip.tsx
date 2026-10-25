"use client";

import type { FeedbackStatus } from "@/lib/feedback/constants";
import { STATUS_CONFIG } from "@/lib/feedback/constants";
import { Chip } from "@mui/material";

type FeedbackStatusChipProps = {
    status: FeedbackStatus;
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
