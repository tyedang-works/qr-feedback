export const FEEDBACK_STATUS_CONFIG = {
    new: {
        label: "Chưa xử lý",
        color: "var(--feedback-status-new-text)",
        backgroundColor: "var(--feedback-status-new-bg)",
        borderColor: "var(--feedback-status-new-border)",
    },
    in_progress: {
        label: "Đang xử lý",
        color: "var(--feedback-status-progress-text)",
        backgroundColor: "var(--feedback-status-progress-bg)",
        borderColor: "var(--feedback-status-progress-border)",
    },
    resolved: {
        label: "Đã xử lý",
        color: "var(--feedback-status-resolved-text)",
        backgroundColor: "var(--feedback-status-resolved-bg)",
        borderColor: "var(--feedback-status-resolved-border)",
    },
} as const;
