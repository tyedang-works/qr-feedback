"use client";

import type { FeedbackIssueOption } from "@/lib/feedback/constants";
import Chip, { type ChipProps } from "@mui/material/Chip";

type FeedbackIssueChipProps = Omit<ChipProps, "color" | "variant"> & {
    option: FeedbackIssueOption;
};

const ISSUE_COLORS: Record<
    FeedbackIssueOption,
    {
        bg: string;
        border: string;
        text: string;
    }
> = {
    food_quality: {
        bg: "var(--color-issue-food-quality-bg)",
        border: "var(--color-issue-food-quality-border)",
        text: "var(--color-issue-food-quality-text)",
    },
    food_presentation: {
        bg: "var(--color-issue-food-presentation-bg)",
        border: "var(--color-issue-food-presentation-border)",
        text: "var(--color-issue-food-presentation-text)",
    },
    service: {
        bg: "var(--color-issue-service-bg)",
        border: "var(--color-issue-service-border)",
        text: "var(--color-issue-service-text)",
    },
    space_cleanliness: {
        bg: "var(--color-issue-cleanliness-bg)",
        border: "var(--color-issue-cleanliness-border)",
        text: "var(--color-issue-cleanliness-text)",
    },
    service_time: {
        bg: "var(--color-issue-service-time-bg)",
        border: "var(--color-issue-service-time-border)",
        text: "var(--color-issue-service-time-text)",
    },
};

export default function FeedbackIssueChip({
    option,
    sx,
    size = "small",
    ...props
}: FeedbackIssueChipProps) {
    const colors = ISSUE_COLORS[option];

    return (
        <Chip
            {...props}
            size={size}
            variant="outlined"
            sx={[
                {
                    height: "auto",
                    minHeight: 27,
                    maxWidth: "100%",
                    borderColor: colors.border,
                    borderRadius: 1,
                    bgcolor: colors.bg,
                    color: colors.text,
                    fontSize: 12,
                    fontWeight: 500,
                    "& .MuiChip-label": {
                        display: "block",
                        whiteSpace: "normal",
                        py: 0.5,
                    },
                },
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        />
    );
}
