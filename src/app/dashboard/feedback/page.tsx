import FeedbackList from "@/components/feedback/FeedbackList";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import FeedbackToolbar from "@/components/feedback/FeedbackToolbar";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_PAGE_SIZE } from "@/lib/feedback/constants";
import { getFeedbackList } from "@/lib/feedback/queries";
import { getRestaurantTables } from "@/lib/tables/queries";
import { Box, Stack, Typography } from "@mui/material";

type FeedbackPageProps = {
    searchParams: Promise<{
        keyword?: string;
        issue?: string;
        tableId?: string;
        page?: string;
    }>;
};

export default async function FeedbackPage({
    searchParams,
}: FeedbackPageProps) {
    const params = await searchParams;

    const keyword = params.keyword ?? "";

    const issue = params.issue && params.issue !== "all" ? params.issue : "";

    const tableId =
        params.tableId && params.tableId !== "all" ? params.tableId : "";

    const parsedPage = Number(params.page);

    const page =
        Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const [feedback, tables] = await Promise.all([
        getFeedbackList(userContext.restaurantId, {
            page,
            pageSize: FEEDBACK_PAGE_SIZE,
            keyword,
            issue,
            tableId,
        }),
        getRestaurantTables(userContext.restaurantId),
    ]);

    return (
        <Stack sx={{ gap: 3 }}>
            <Box>
                <Typography
                    sx={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Feedback
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 14,
                        color: "#667085",
                    }}
                >
                    Quản lý tất cả phản hồi của khách hàng.
                </Typography>
            </Box>

            <FeedbackToolbar
                keyword={keyword}
                issue={issue}
                tableId={tableId}
                tables={tables}
            />

            <Typography
                sx={{
                    fontSize: 14,
                    color: "#667085",
                }}
            >
                Tổng số phản hồi:{" "}
                <Box
                    component="span"
                    sx={{
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    {feedback.total}
                </Box>
            </Typography>

            <FeedbackList data={feedback.data} />

            <FeedbackPagination
                page={feedback.page}
                pageSize={feedback.pageSize}
                total={feedback.total}
                totalPages={feedback.totalPages}
            />
        </Stack>
    );
}
