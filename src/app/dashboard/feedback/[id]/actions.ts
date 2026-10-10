"use server";

import { canManageFeedback } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_STATUS } from "@/lib/feedback/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type UpdateFeedbackInput = {
    feedbackPublicId: string;
    status: string;
    internalNote: string;
};

type UpdateFeedbackResult = {
    success: boolean;
    message: string;
};

export async function updateFeedback(
    input: UpdateFeedbackInput,
): Promise<UpdateFeedbackResult> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Bạn cần đăng nhập để thực hiện thao tác này.",
        };
    }

    if (!canManageFeedback(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền quản lý phản hồi.",
        };
    }

    const feedbackPublicId = input.feedbackPublicId.trim();
    const internalNote = input.internalNote.trim();

    if (!feedbackPublicId) {
        return {
            success: false,
            message: "Không tìm thấy phản hồi.",
        };
    }

    if (
        !Object.values(FEEDBACK_STATUS).includes(
            input.status as (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS],
        )
    ) {
        return {
            success: false,
            message: "Trạng thái phản hồi không hợp lệ.",
        };
    }

    if (internalNote.length > 1000) {
        return {
            success: false,
            message: "Ghi chú nội bộ không được vượt quá 1000 ký tự.",
        };
    }

    const supabase = await createAdminClient();

    const { data: feedback, error: feedbackError } = await supabase
        .from("feedback")
        .select("id")
        .eq("public_id", feedbackPublicId)
        .eq("restaurant_id", userContext.restaurantId)
        .maybeSingle();

    if (feedbackError) {
        console.error("Failed to find feedback:", feedbackError);

        return {
            success: false,
            message: "Không thể tìm thấy phản hồi.",
        };
    }

    if (!feedback) {
        return {
            success: false,
            message: "Không tìm thấy phản hồi.",
        };
    }

    const { error: updateError } = await supabase
        .from("feedback")
        .update({
            status: input.status,
            internal_note: internalNote || null,
        })
        .eq("id", feedback.id)
        .eq("restaurant_id", userContext.restaurantId);

    if (updateError) {
        console.error("Failed to update feedback:", updateError);

        return {
            success: false,
            message: "Không thể cập nhật phản hồi.",
        };
    }

    revalidatePath("/dashboard/feedback");
    revalidatePath(`/dashboard/feedback/${feedbackPublicId}`);

    return {
        success: true,
        message: "Cập nhật phản hồi thành công.",
    };
}
