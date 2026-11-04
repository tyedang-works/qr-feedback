import type { FeedbackStatus } from "@/lib/feedback/constants";

export type FeedbackListItem = {
    id: string;
    publicId: string;
    tableId: string;
    tableName: string;
    selectedOptions: string[];
    feedback: string;
    phone: string;
    status: FeedbackStatus;
    internalNote: string | null;
    resolvedByName: string | null;
    resolvedAt: string | null;
    createdAt: string;
};

export type FeedbackFilters = {
    page: number;
    pageSize: number;
    keyword: string;
    issues: string[];
    tableIds: string[];
    status?: string;
    startDate?: string;
    endDate?: string;
    sort?: "newest" | "oldest";
};

export type FeedbackListResult = {
    data: FeedbackListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export type FeedbackDetail = {
    id: string;
    publicId: string;
    tableId: string;
    tableName: string;
    selectedOptions: string[];
    feedback: string;
    phone: string;
    status: FeedbackStatus;
    internalNote: string | null;
    resolvedByName: string | null;
    resolvedAt: string | null;
    createdAt: string;
};

export type FeedbackSummary = {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
};

export type FeedbackSummaryTrendItem = {
    date: string;
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
};
