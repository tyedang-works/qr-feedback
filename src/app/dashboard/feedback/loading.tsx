import PageHeaderSkeleton from "@/components/common/skeleton/PageHeaderSkeleton";
import FeedbackListSkeleton from "@/components/feedback/skeletons/FeedbackListSkeleton";
import FeedbackPaginationSkeleton from "@/components/feedback/skeletons/FeedbackPaginationSkeleton";
import FeedbackToolbarSkeleton from "@/components/feedback/skeletons/FeedbackToolbarSkeleton";
import { Stack } from "@mui/material";

export default function FeedbackLoading() {
    return (
        <Stack
            sx={{
                width: "100%",
                minWidth: 0,
                mx: "auto",
                gap: { xs: 2, md: 2.5 },
            }}
        >
            <PageHeaderSkeleton titleWidth={150} subtitleWidth={300} />
            <FeedbackToolbarSkeleton />
            <FeedbackListSkeleton />
            <FeedbackPaginationSkeleton />
        </Stack>
    );
}
