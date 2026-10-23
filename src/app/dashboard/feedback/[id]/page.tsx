import FeedbackDetail from "@/components/feedback/FeedbackDetail";
import { USER_ROLES } from "@/lib/auth/constants";
import { getUserContext } from "@/lib/auth/queries";
import { getFeedbackDetail } from "@/lib/feedback/queries";
import { notFound, redirect } from "next/navigation";

type FeedbackDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function FeedbackDetailPage({
    params,
}: FeedbackDetailPageProps) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const { id: feedbackPublicId } = await params;

    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    if (userContext.role === USER_ROLES.MANAGER) {
        redirect("/dashboard");
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
