"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { FeedbackIssueOption } from "@/lib/feedback/constants";
import FeedbackIssueChip from "./FeedbackIssueChip";

const ISSUE_TRANSLATION_KEYS: Record<
    FeedbackIssueOption,
    | "foodQuality"
    | "foodPresentation"
    | "serviceIssue"
    | "spaceCleanliness"
    | "serviceTime"
> = {
    food_quality: "foodQuality",
    food_presentation: "foodPresentation",
    service: "serviceIssue",
    space_cleanliness: "spaceCleanliness",
    service_time: "serviceTime",
};

type FeedbackIssueChipTranslatedProps = {
    option: FeedbackIssueOption;
};

export default function FeedbackIssueChipTranslated({
    option,
}: FeedbackIssueChipTranslatedProps) {
    const { t } = useTranslation();

    return (
        <FeedbackIssueChip
            option={option}
            label={t("dashboard", ISSUE_TRANSLATION_KEYS[option])}
        />
    );
}
