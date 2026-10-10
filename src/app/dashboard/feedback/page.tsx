import FeedbackList from "@/components/feedback/FeedbackList";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import FeedbackToolbar from "@/components/feedback/FeedbackToolbar";
import { USER_ROLES } from "@/lib/auth/constants";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_PAGE_SIZE } from "@/lib/feedback/constants";
import { getFeedbackList } from "@/lib/feedback/queries";
import { getRestaurantTables } from "@/lib/tables/queries";
import { Box, Stack, Typography } from "@mui/material";
import { redirect } from "next/navigation";

type FeedbackPageProps = {
    searchParams: Promise<{
        keyword?: string;
        issue?: string;
        tableId?: string;
        status?: string;
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
    const status =
        params.status && params.status !== "all" ? params.status : "";

    const parsedPage = Number(params.page);
    const page =
        Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    if (userContext.role === USER_ROLES.MANAGER) {
        redirect("/dashboard");
    }

    const [feedback, tables] = await Promise.all([
        getFeedbackList(userContext.restaurantId, {
            page,
            pageSize: FEEDBACK_PAGE_SIZE,
            keyword,
            issue,
            tableId,
            status,
        }),
        getRestaurantTables(userContext.restaurantId),
    ]);

    return (
        <Stack
            sx={{
                width: "100%",
                maxWidth: 1440,
                mx: "auto",
                gap: { xs: 2.5, md: 3 },
            }}
        >
            <Box>
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: 22, md: 26 },
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "#193B56",
                    }}
                >
                    Feedback
                </Typography>

                <Typography
                    sx={{
                        mt: 0.75,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#667085",
                    }}
                >
                    Theo dõi và xử lý phản hồi của khách hàng.
                </Typography>
            </Box>

            <FeedbackToolbar
                keyword={keyword}
                issue={issue}
                tableId={tableId}
                tables={tables}
                status={status}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        color: "#667085",
                    }}
                >
                    Tổng số phản hồi{" "}
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
            </Stack>

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
