"use server";

import { canManageFeedback } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_STATUS } from "@/lib/feedback/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type UpdateFeedbackMessageKey =
    | "loginRequired"
    | "feedbackManagePermissionDenied"
    | "feedbackNotFound"
    | "invalidFeedbackStatus"
    | "internalNoteMaxLength"
    | "findFeedbackFailed"
    | "updateFeedbackFailed"
    | "updateFeedbackSuccess";

type UpdateFeedbackInput = {
    feedbackPublicId: string;
    status: string;
    internalNote: string;
};

type UpdateFeedbackResult = {
    success: boolean;
    message: UpdateFeedbackMessageKey;
};

export async function updateFeedback(
    input: UpdateFeedbackInput,
): Promise<UpdateFeedbackResult> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "loginRequired",
        };
    }

    if (!canManageFeedback(userContext.role)) {
        return {
            success: false,
            message: "feedbackManagePermissionDenied",
        };
    }

    const feedbackPublicId = input.feedbackPublicId.trim();
    const internalNote = input.internalNote.trim();

    if (!feedbackPublicId) {
        return {
            success: false,
            message: "feedbackNotFound",
        };
    }

    if (
        !Object.values(FEEDBACK_STATUS).includes(
            input.status as (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS],
        )
    ) {
        return {
            success: false,
            message: "invalidFeedbackStatus",
        };
    }

    if (internalNote.length > 1000) {
        return {
            success: false,
            message: "internalNoteMaxLength",
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
            message: "findFeedbackFailed",
        };
    }

    if (!feedback) {
        return {
            success: false,
            message: "feedbackNotFound",
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
            message: "updateFeedbackFailed",
        };
    }

    revalidatePath("/dashboard/feedback");
    revalidatePath(`/dashboard/feedback/${feedbackPublicId}`);

    return {
        success: true,
        message: "updateFeedbackSuccess",
    };
}
