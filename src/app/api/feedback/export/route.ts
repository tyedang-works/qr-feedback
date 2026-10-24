import { canAccessFeedbackPage } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
    FEEDBACK_STATUS,
} from "@/lib/feedback/constants";
import { getFeedbackExport } from "@/lib/feedback/queries";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const STATUS_LABELS: Record<string, string> = {
    [FEEDBACK_STATUS.NEW]: "Chưa xử lý",
    [FEEDBACK_STATUS.IN_PROGRESS]: "Đang xử lý",
    [FEEDBACK_STATUS.RESOLVED]: "Đã xử lý",
};

function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
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

export async function GET(request: Request) {
    try {
        const userContext = await getUserContext();

        if (!userContext) {
            return NextResponse.json(
                { message: "Vui lòng đăng nhập để tiếp tục." },
                { status: 401 },
            );
        }

        if (!canAccessFeedbackPage(userContext.role)) {
            return NextResponse.json(
                { message: "Bạn không có quyền xuất báo cáo." },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(request.url);

        const keyword = searchParams.get("keyword") ?? "";
        const issues = searchParams.getAll("issue");
        const tableId = searchParams.get("tableId") ?? "";
        const status = searchParams.get("status") ?? "";

        const data = await getFeedbackExport(userContext.restaurantId, {
            keyword,
            issues,
            tableId,
            status,
        });

        const headers = [
            "Mã phản hồi",
            "Bàn",
            "Thời gian",
            "Trạng thái",
            "Vấn đề",
            "Nội dung",
            "Số điện thoại",
        ];

        const rows = data.map((item) => [
            item.publicId,
            item.tableName,
            formatDateTime(item.createdAt),
            STATUS_LABELS[item.status] ?? item.status,
            item.selectedOptions
                .map((option) => FEEDBACK_ISSUE_LABEL_MAP[option] ?? option)
                .join(", "),
            item.feedback,
            item.phone,
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        for (let rowIndex = 1; rowIndex <= rows.length; rowIndex += 1) {
            const phoneCell = XLSX.utils.encode_cell({
                r: rowIndex,
                c: 6,
            });

            if (worksheet[phoneCell]) {
                worksheet[phoneCell].t = "s";
                worksheet[phoneCell].v = String(rows[rowIndex - 1][6] ?? "");
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

        worksheet["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: rows.length, c: headers.length - 1 },
            }),
        };

        worksheet["!freeze"] = {
            xSplit: 0,
            ySplit: 1,
            topLeftCell: "A2",
            activePane: "bottomLeft",
            state: "frozen",
        };

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Phản hồi");

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
            { message: "Không thể xuất báo cáo phản hồi." },
            { status: 500 },
        );
    }
}
