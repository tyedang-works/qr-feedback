import FeedbackList from "@/components/feedback/FeedbackList";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import FeedbackSummary from "@/components/feedback/FeedbackSummary";
import FeedbackToolbar from "@/components/feedback/FeedbackToolbar";
import { USER_ROLES } from "@/lib/auth/constants";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_PAGE_SIZE } from "@/lib/feedback/constants";
import { getFeedbackList, getFeedbackSummary } from "@/lib/feedback/queries";
import { getRestaurantTables } from "@/lib/tables/queries";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
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

    const [feedback, tables, summary] = await Promise.all([
        getFeedbackList(userContext.restaurantId, {
            page,
            pageSize: FEEDBACK_PAGE_SIZE,
            keyword,
            issue,
            tableId,
            status,
        }),
        getRestaurantTables(userContext.restaurantId),
        getFeedbackSummary(userContext.restaurantId),
    ]);

    const exportParams = new URLSearchParams();

    if (keyword) {
        exportParams.set("keyword", keyword);
    }

    if (issue) {
        exportParams.set("issue", issue);
    }

    if (tableId) {
        exportParams.set("tableId", tableId);
    }

    if (status) {
        exportParams.set("status", status);
    }

    const exportQuery = exportParams.toString();
    const exportUrl = exportQuery
        ? `/api/feedback/export?${exportQuery}`
        : "/api/feedback/export";

    return (
        <Stack
            sx={{
                width: "100%",
                minWidth: 0,
                mx: "auto",
                gap: { xs: 2, md: 2.5 },
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
                        mt: 0.5,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#667085",
                    }}
                >
                    Theo dõi và xử lý phản hồi của khách hàng.
                </Typography>
            </Box>

            <FeedbackSummary data={summary} />

            <FeedbackToolbar
                key={`${keyword}-${issue}-${tableId}-${status}`}
                keyword={keyword}
                issue={issue}
                tableId={tableId}
                tables={tables}
                status={status}
                summary={summary}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
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

                <Link
                    href={exportUrl}
                    aria-disabled={feedback.total === 0}
                    tabIndex={feedback.total === 0 ? -1 : undefined}
                    style={{
                        textDecoration: "none",
                        pointerEvents:
                            feedback.total === 0 ? "none" : undefined,
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={feedback.total === 0}
                        startIcon={<FontAwesomeIcon icon={faFileExcel} />}
                        sx={{
                            height: 38,
                            px: 2,
                            borderRadius: 1.5,
                            borderColor: "#193B56",
                            color: "#193B56",
                            fontSize: 13,
                            fontWeight: 600,
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            "&:hover": {
                                borderColor: "#193B56",
                                backgroundColor: "#F0F6FA",
                            },
                        }}
                    >
                        Xuất Excel
                    </Button>
                </Link>
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
