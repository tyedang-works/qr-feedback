import FeedbackDetail from "@/components/feedback/FeedbackDetail";
import { getUserContext } from "@/lib/auth/queries";
import { getFeedbackDetail } from "@/lib/feedback/queries";
import { notFound } from "next/navigation";

type FeedbackDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function FeedbackDetailPage({
    params,
}: FeedbackDetailPageProps) {
    const { id: feedbackPublicId } = await params;

    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const feedback = await getFeedbackDetail(
        userContext.restaurantId,
        feedbackPublicId,
    );

    if (!feedback) {
        notFound();
    }

    return <FeedbackDetail data={feedback} />;
}