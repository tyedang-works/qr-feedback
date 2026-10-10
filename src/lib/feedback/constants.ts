export const FEEDBACK_PAGE_SIZE = 10;

export const FEEDBACK_STATUS = {
    NEW: "new",
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
} as const;

export type FeedbackStatus =
    (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS];

export const FEEDBACK_ISSUES = [
    {
        option: "food_quality",
        label: "Món ăn chưa đạt yêu cầu",
    },
    {
        option: "food_presentation",
        label: "Món ăn trình bày chưa đẹp",
    },
    {
        option: "service",
        label: "Phục vụ chưa tốt",
    },
    {
        option: "space_cleanliness",
        label: "Không gian / vệ sinh chưa tốt",
    },
    {
        option: "service_time",
        label: "Thời gian phục vụ quá lâu",
    },
] as const;

export const FEEDBACK_ISSUE_LABEL_MAP = Object.fromEntries(
    FEEDBACK_ISSUES.map((issue) => [issue.option, issue.label]),
) as Record<string, string>;
