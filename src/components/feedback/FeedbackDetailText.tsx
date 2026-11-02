"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";

type FeedbackDetailTextKey =
    | "backToFeedback"
    | "detailTitle"
    | "detailSubtitle"
    | "feedbackInformation"
    | "feedbackInformationDescription"
    | "table"
    | "submittedAt"
    | "selectedIssues"
    | "noSelectedIssues"
    | "customerFeedback"
    | "customerFeedbackDescription"
    | "noFeedbackContent"
    | "contactPhone"
    | "feedbackManagement"
    | "feedbackManagementDescription"
    | "food_quality"
    | "food_presentation"
    | "service"
    | "space_cleanliness"
    | "service_time";

type FeedbackDetailTextProps = {
    translationKey: FeedbackDetailTextKey;
};

export default function FeedbackDetailText({
    translationKey,
}: FeedbackDetailTextProps) {
    const { t } = useTranslation();

    return <>{t("feedback", translationKey)}</>;
}
