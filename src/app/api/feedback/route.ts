import { resend } from "@/lib/email/resend";
import { createFeedbackEmailHtml } from "@/lib/email/templates/feedback-email";
import { feedbackRateLimit } from "@/lib/rate-limit/feedback";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const ALLOWED_OPTIONS = new Set([
    "food_quality",
    "food_presentation",
    "service",
    "space_cleanliness",
    "service_time",
]);

const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

type FeedbackPayload = {
    tableToken?: unknown;
    selectedOptions?: unknown;
    feedback?: unknown;
    phone?: unknown;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as FeedbackPayload;

        const tableToken =
            typeof body.tableToken === "string" ? body.tableToken.trim() : "";

        const selectedOptions = Array.isArray(body.selectedOptions)
            ? body.selectedOptions.filter(
                  (item): item is string => typeof item === "string",
              )
            : [];

        const feedback =
            typeof body.feedback === "string" ? body.feedback.trim() : "";

        const phone =
            typeof body.phone === "string" ? body.phone.replace(/\s/g, "") : "";

        if (!tableToken) {
            return NextResponse.json(
                { message: "Thiếu thông tin bàn." },
                { status: 400 },
            );
        }

        if (selectedOptions.some((option) => !ALLOWED_OPTIONS.has(option))) {
            return NextResponse.json(
                { message: "Lựa chọn phản hồi không hợp lệ." },
                { status: 400 },
            );
        }

        if (selectedOptions.length === 0 && !feedback) {
            return NextResponse.json(
                {
                    message:
                        "Vui lòng chọn ít nhất một vấn đề hoặc chia sẻ thêm phản hồi.",
                },
                { status: 400 },
            );
        }

        if (!phone) {
            return NextResponse.json(
                { message: "Vui lòng nhập số điện thoại." },
                { status: 400 },
            );
        }

        if (!PHONE_REGEX.test(phone)) {
            return NextResponse.json(
                { message: "Số điện thoại không hợp lệ." },
                { status: 400 },
            );
        }

        if (feedback.length > 1000) {
            return NextResponse.json(
                {
                    message:
                        "Nội dung phản hồi không được vượt quá 1000 ký tự.",
                },
                { status: 400 },
            );
        }

        const forwardedFor = request.headers.get("x-forwarded-for");

        const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

        const identifier = `${ip}:${tableToken}`;

        const { success, limit, remaining, reset } =
            await feedbackRateLimit.limit(identifier);

        if (!success) {
            return NextResponse.json(
                {
                    message:
                        "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
                },
                {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": String(limit),
                        "X-RateLimit-Remaining": String(remaining),
                        "X-RateLimit-Reset": String(reset),
                        "Retry-After": String(
                            Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
                        ),
                    },
                },
            );
        }

        const supabase = createAdminClient();

        const { data: table, error: tableError } = await supabase
            .from("tables")
            .select("id, restaurant_id, name")
            .eq("token", tableToken)
            .single();

        if (tableError || !table) {
            return NextResponse.json(
                { message: "Không tìm thấy bàn." },
                { status: 404 },
            );
        }

        const { data: restaurant, error: restaurantError } = await supabase
            .from("restaurants")
            .select("name")
            .eq("id", table.restaurant_id)
            .single();

        if (restaurantError) {
            console.error("Failed to get restaurant:", restaurantError);
        }

        const { error: insertError } = await supabase.from("feedback").insert({
            restaurant_id: table.restaurant_id,
            table_id: table.id,
            selected_options: selectedOptions,
            feedback,
            phone,
        });

        if (insertError) {
            console.error("Failed to insert feedback:", insertError);

            return NextResponse.json(
                { message: "Không thể lưu phản hồi." },
                { status: 500 },
            );
        }
        const createdAt = new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        });

        const emailHtml = createFeedbackEmailHtml({
            restaurantName: restaurant?.name ?? "Không xác định",
            tableName: table.name,
            selectedOptions,
            feedback,
            phone,
            createdAt,
        });

        const { error: emailError } = await resend.emails.send({
            from: "QR Feedback <onboarding@resend.dev>",
            to: process.env.FEEDBACK_EMAIL!,
            subject: `[QR Feedback] Phản hồi mới • ${table.name}`,
            html: emailHtml,
        });

        if (emailError) {
            console.error("Failed to send feedback email:", emailError);
        }

        return NextResponse.json(
            {
                message: "Gửi phản hồi thành công.",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Feedback API error:", error);

        return NextResponse.json(
            {
                message: "Có lỗi xảy ra. Vui lòng thử lại.",
            },
            { status: 500 },
        );
    }
}
