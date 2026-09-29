import QRCodePageClient from "@/components/qr-codes/QRCodePageClient";
import { getUserContext } from "@/lib/auth/queries";
import { getQRCodeTables } from "@/lib/qr-codes/queries";
import type {
    QRCodeFilters,
    QRCodePageSize,
    QRCodeSort,
    QRCodeStatusFilter,
} from "@/lib/qr-codes/types";

type QRCodePageProps = {
    searchParams: Promise<{
        page?: string;
        pageSize?: string;
        keyword?: string;
        status?: string;
        sort?: string;
    }>;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE: QRCodePageSize = 10;
const DEFAULT_STATUS: QRCodeStatusFilter = "all";
const DEFAULT_SORT: QRCodeSort = "name_asc";

const PAGE_SIZES: QRCodePageSize[] = [10, 25, 50];

const STATUSES: QRCodeStatusFilter[] = ["all", "active", "inactive"];

const SORTS: QRCodeSort[] = ["name_asc", "name_desc"];

function parsePositiveInteger(value: string | undefined, fallback: number) {
    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePageSize(value: string | undefined): QRCodePageSize {
    const parsed = Number(value);

    return PAGE_SIZES.includes(parsed as QRCodePageSize)
        ? (parsed as QRCodePageSize)
        : DEFAULT_PAGE_SIZE;
}

function parseStatus(value: string | undefined): QRCodeStatusFilter {
    return STATUSES.includes(value as QRCodeStatusFilter)
        ? (value as QRCodeStatusFilter)
        : DEFAULT_STATUS;
}

function parseSort(value: string | undefined): QRCodeSort {
    return SORTS.includes(value as QRCodeSort)
        ? (value as QRCodeSort)
        : DEFAULT_SORT;
}

export default async function QRCodePage({ searchParams }: QRCodePageProps) {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const params = await searchParams;

    const filters: QRCodeFilters = {
        page: parsePositiveInteger(params.page, DEFAULT_PAGE),
        pageSize: parsePageSize(params.pageSize),
        keyword: params.keyword?.trim() ?? "",
        status: parseStatus(params.status),
        sort: parseSort(params.sort),
    };

    const result = await getQRCodeTables(userContext.restaurantId, filters);

    return <QRCodePageClient result={result} filters={filters} />;
}
