import PageHeaderSkeleton from "@/components/common/skeleton/PageHeaderSkeleton";
import FeedbackButtonExportSkeleton from "@/components/feedback/skeletons/FeedbackButtonExportSkeleton";
import FeedbackDetailSkeleton from "@/components/feedback/skeletons/FeedbackDetailSkeleton";
import FeedbackListSkeleton from "@/components/feedback/skeletons/FeedbackListSkeleton";
import FeedbackPaginationSkeleton from "@/components/feedback/skeletons/FeedbackPaginationSkeleton";
import FeedbackSummarySkeleton from "@/components/feedback/skeletons/FeedbackSummarySkeleton";
import FeedbackToolbarSkeleton from "@/components/feedback/skeletons/FeedbackToolbarSkeleton";
import { Box, Stack } from "@mui/material";

export default function FeedbackLoading() {
    return (
        <Stack
            aria-label="Đang tải phản hồi"
            sx={{
                width: "100%",
                minWidth: 0,
                mx: "auto",
                gap: { xs: 2, md: 2.5 },
            }}
        >
            <PageHeaderSkeleton titleWidth={150} subtitleWidth={300} />
            <FeedbackSummarySkeleton />
            <FeedbackToolbarSkeleton />
            <FeedbackButtonExportSkeleton />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        lg: "minmax(0, 1fr) minmax(0, 1.25fr)",
                    },
                    gap: 2,
                    alignItems: "start",
                    minWidth: 0,
                }}
            >
                <FeedbackListSkeleton />
                <Box sx={{ display: { xs: "none", lg: "block" }, minWidth: 0 }}>
                    <FeedbackDetailSkeleton />
                </Box>
            </Box>

            <FeedbackPaginationSkeleton />
        </Stack>
    );
}
