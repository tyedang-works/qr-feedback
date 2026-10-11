import type { FeedbackStatus } from "@/lib/feedback/constants";

export type FeedbackTrendItem = {
    date: string;
    label: string;
    count: number;
};

export type IssueDistributionItem = {
    option: string;
    label: string;
    count: number;
    percentage: number;
};

export type FeedbackStatusDistributionItem = {
    status: FeedbackStatus;
    label: string;
    count: number;
    percentage: number;
};

export type RecentFeedbackItem = {
    id: string;
    tableName: string;
    selectedOptions: string[];
    feedback: string;
    status: FeedbackStatus;
    createdAt: string;
};
