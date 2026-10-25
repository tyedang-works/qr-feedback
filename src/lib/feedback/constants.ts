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

export type FeedbackIssueOption = (typeof FEEDBACK_ISSUES)[number]["option"];

const FEEDBACK_ISSUE_OPTIONS = new Set<string>(
    FEEDBACK_ISSUES.map(({ option }) => option),
);

export function isFeedbackIssueOption(
    option: string,
): option is FeedbackIssueOption {
    return FEEDBACK_ISSUE_OPTIONS.has(option);
}

export const STATUS_CONFIG: Record<
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
