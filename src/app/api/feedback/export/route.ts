import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { canAccessFeedbackPage } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
    FEEDBACK_STATUS,
} from "@/lib/feedback/constants";
import { getFeedbackExport } from "@/lib/feedback/queries";

type Locale = "vi" | "en";

const EXPORT_TRANSLATIONS = {
    vi: {
        unauthorized: "Vui lòng đăng nhập để tiếp tục.",
        forbidden: "Bạn không có quyền xuất báo cáo.",
        exportError: "Không thể xuất báo cáo phản hồi.",
        sheetName: "Phản hồi",
        headers: [
            "Mã phản hồi",
            "Bàn",
            "Thời gian",
            "Trạng thái",
            "Vấn đề",
            "Nội dung",
            "Số điện thoại",
        ],
        statuses: {
            [FEEDBACK_STATUS.NEW]: "Chưa xử lý",
            [FEEDBACK_STATUS.IN_PROGRESS]: "Đang xử lý",
            [FEEDBACK_STATUS.RESOLVED]: "Đã xử lý",
        },
    },
    en: {
        unauthorized: "Please sign in to continue.",
        forbidden: "You do not have permission to export this report.",
        exportError: "Unable to export the feedback report.",
        sheetName: "Feedback",
        headers: [
            "Feedback ID",
            "Table",
            "Date",
            "Status",
            "Issues",
            "Content",
            "Phone number",
        ],
        statuses: {
            [FEEDBACK_STATUS.NEW]: "New",
            [FEEDBACK_STATUS.IN_PROGRESS]: "In progress",
            [FEEDBACK_STATUS.RESOLVED]: "Resolved",
        },
    },
} satisfies Record<
    Locale,
    {
        unauthorized: string;
        forbidden: string;
        exportError: string;
        sheetName: string;
        headers: string[];
        statuses: Record<string, string>;
    }
>;

const ISSUE_LABELS_EN: Record<string, string> = {
    food_quality: "Food quality",
    food_presentation: "Food presentation",
    service: "Service",
    space_cleanliness: "Cleanliness",
    service_time: "Service time",
};

function getLocale(value: string | null): Locale {
    return value === "en" ? "en" : "vi";
}

function formatDateTime(
    dateString: string | null | undefined,
    locale: Locale,
): string {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).format(date);
}

function getVietnamDate(): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value]),
    );

    return `${values.year}-${values.month}-${values.day}`;
}

function getIssueLabels(
    selectedOptions: string[] | null | undefined,
    locale: Locale,
): string {
    if (!selectedOptions?.length) return "";

    return selectedOptions
        .map((option) => {
            if (locale === "en") {
                return ISSUE_LABELS_EN[option] ?? option;
            }

            return FEEDBACK_ISSUE_LABEL_MAP[option] ?? option;
        })
        .join(", ");
}

function getStatusLabel(status: string, locale: Locale): string {
    const statusLabels: Record<string, string> =
        EXPORT_TRANSLATIONS[locale].statuses;

    return statusLabels[status] ?? status;
}

function createWorksheet(
    rows: (string | number)[][],
    headers: string[],
): XLSX.WorkSheet {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Keep phone numbers as text to preserve leading zeros.
    for (let rowIndex = 1; rowIndex <= rows.length; rowIndex += 1) {
        const phoneCell = XLSX.utils.encode_cell({
            r: rowIndex,
            c: 6,
        });

        const cell = worksheet[phoneCell];

        if (cell) {
            cell.t = "s";
            cell.v = String(cell.v ?? "");
        }
    }

    worksheet["!cols"] = [
        { wch: 20 },
        { wch: 14 },
        { wch: 22 },
        { wch: 18 },
        { wch: 48 },
        { wch: 45 },
        { wch: 18 },
    ];

    if (rows.length > 0) {
        worksheet["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: rows.length, c: headers.length - 1 },
            }),
        };
    }

    return worksheet;
}

export async function GET(request: Request) {
    try {
        const userContext = await getUserContext();

        if (!userContext) {
            return NextResponse.json(
                { message: EXPORT_TRANSLATIONS.vi.unauthorized },
                { status: 401 },
            );
        }

        if (!canAccessFeedbackPage(userContext.role)) {
            return NextResponse.json(
                { message: EXPORT_TRANSLATIONS.vi.forbidden },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(request.url);
        const locale = getLocale(searchParams.get("locale"));
        const translations = EXPORT_TRANSLATIONS[locale];

        const keyword = searchParams.get("keyword") ?? "";
        const issues = searchParams.getAll("issue");
        const tableIds = searchParams.getAll("tableId");
        const status = searchParams.get("status") ?? "";

        const data = await getFeedbackExport(userContext.restaurantId, {
            keyword,
            issues,
            tableIds,
            status,
        });

        const rows = data.map((item) => [
            item.publicId ?? "",
            item.tableName ?? "",
            formatDateTime(item.createdAt, locale),
            getStatusLabel(item.status, locale),
            getIssueLabels(item.selectedOptions, locale),
            item.feedback ?? "",
            String(item.phone ?? ""),
        ]);

        const worksheet = createWorksheet(rows, translations.headers);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            translations.sheetName,
        );

        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });

        const fileName = `feedback-report-${getVietnamDate()}.xlsx`;

        return new Response(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        console.error("Failed to export feedback:", error);

        return NextResponse.json(
            { message: EXPORT_TRANSLATIONS.vi.exportError },
            { status: 500 },
        );
    }
}
