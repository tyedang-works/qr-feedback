export type QRCodeTable = {
    id: string;
    name: string;
    token: string;
    isActive: boolean;
};

export type QRCodePageSize = 10 | 25 | 50;

export type QRCodeStatusFilter = "all" | "active" | "inactive";

export type QRCodeSort = "name_asc" | "name_desc";

export type QRCodeFilters = {
    page: number;
    pageSize: QRCodePageSize;
    keyword: string;
    status: QRCodeStatusFilter;
    sort: QRCodeSort;
};

export type QRCodeListResult = {
    data: QRCodeTable[];
    total: number;
    page: number;
    pageSize: QRCodePageSize;
    totalPages: number;
};

export type QRCodeSelection = {
    mode: "manual" | "all";
    selectedIds: string[];
    excludedIds: string[];
};
