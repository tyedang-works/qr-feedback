import { getUserContext } from "@/lib/auth/queries";
import { getFeedbackTrend } from "@/lib/dashboard/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const userContext = await getUserContext();

        if (!userContext) {
            return NextResponse.json(
                { message: "Vui lòng đăng nhập để tiếp tục." },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(request.url);
        const periodParam = searchParams.get("period");

        if (periodParam !== "7" && periodParam !== "30") {
            return NextResponse.json(
                { message: "Khoảng thời gian không hợp lệ." },
                { status: 400 },
            );
        }

        const data = await getFeedbackTrend(
            userContext.restaurantId,
            Number(periodParam) as 7 | 30,
        );

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Failed to get feedback trend:", error);

        return NextResponse.json(
            { message: "Không thể tải dữ liệu xu hướng phản hồi." },
            { status: 500 },
        );
    }
}
