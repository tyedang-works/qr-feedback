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
    createdAt: string;
};

export type FeedbackFilters = {
    page: number;
    pageSize: number;
    keyword: string;
    issue: string;
    tableId: string;
    status?: string;
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
    createdAt: string;
};
