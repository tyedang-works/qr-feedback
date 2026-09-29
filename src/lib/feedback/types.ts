export type FeedbackListItem = {
    id: string;
    publicId: string;
    tableId: string;
    tableName: string;
    selectedOptions: string[];
    feedback: string;
    phone: string;
    createdAt: string;
};

export type FeedbackFilters = {
    page: number;
    pageSize: number;
    keyword: string;
    issue: string;
    tableId: string;
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
    tableId: string;
    tableName: string;
    selectedOptions: string[];
    feedback: string;
    phone: string;
    createdAt: string;
};
