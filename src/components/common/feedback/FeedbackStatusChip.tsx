"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { FeedbackStatus } from "@/lib/feedback/constants";
import { STATUS_CONFIG } from "@/lib/feedback/constants";
import { Chip } from "@mui/material";

type FeedbackStatusChipProps = {
    status: FeedbackStatus;
};

type FeedbackStatusTranslationKey = "new" | "inProgress" | "resolved";

function getStatusTranslationKey(
    status: FeedbackStatus,
): FeedbackStatusTranslationKey {
    switch (status) {
        case "new":
            return "new";
        case "in_progress":
            return "inProgress";
        case "resolved":
            return "resolved";
    }
}

export default function FeedbackStatusChip({
    status,
}: FeedbackStatusChipProps) {
    const { t } = useTranslation();
    const config = STATUS_CONFIG[status];

    return (
        <Chip
            label={t("dashboard", getStatusTranslationKey(status))}
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
