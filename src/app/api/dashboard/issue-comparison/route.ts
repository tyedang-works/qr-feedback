import { getUserContext } from "@/lib/auth/queries";
import { getIssueComparison } from "@/lib/dashboard/queries";
import type { IssueComparisonPeriod } from "@/lib/dashboard/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const userContext = await getUserContext();

        if (!userContext) {
            return NextResponse.json(
                { message: "Bạn cần đăng nhập để xem thống kê." },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(request.url);

        const rawPeriod = searchParams.get("period") ?? "week";
        const period: IssueComparisonPeriod =
            rawPeriod === "month" ? "month" : "week";

        if (rawPeriod !== "week" && rawPeriod !== "month") {
            return NextResponse.json(
                { message: "Khoảng thời gian không hợp lệ." },
                { status: 400 },
            );
        }

        const rawYear = searchParams.get("year");
        const rawMonth = searchParams.get("month");

        const year = rawYear ? Number(rawYear) : undefined;
        const month = rawMonth ? Number(rawMonth) : undefined;

        if (
            period === "month" &&
            (year === undefined ||
                month === undefined ||
                !Number.isInteger(year) ||
                !Number.isInteger(month))
        ) {
            return NextResponse.json(
                { message: "Vui lòng chọn tháng và năm hợp lệ." },
                { status: 400 },
            );
        }

        const result = await getIssueComparison(
            userContext.restaurantId,
            period,
            year,
            month,
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to load issue comparison:", error);

        return NextResponse.json(
            { message: "Không thể tải dữ liệu so sánh vấn đề." },
            { status: 500 },
        );
    }
}
