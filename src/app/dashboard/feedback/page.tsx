import PageHeader from "@/components/common/layout/PageHeader";
import ExportFeedbackButton from "@/components/feedback/ExportFeedbackButton";
import FeedbackList from "@/components/feedback/FeedbackList";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import FeedbackSummary from "@/components/feedback/FeedbackSummary";
import FeedbackToolbar from "@/components/feedback/FeedbackToolbar";
import { USER_ROLES } from "@/lib/auth/constants";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_ISSUES, FEEDBACK_PAGE_SIZE } from "@/lib/feedback/constants";
import { getFeedbackList, getFeedbackSummary } from "@/lib/feedback/queries";
import { getRestaurantTables } from "@/lib/tables/queries";
import { Stack } from "@mui/material";
import { MessageCircle } from "lucide-react";
import { redirect } from "next/navigation";

type FeedbackPageProps = {
    searchParams: Promise<{
        keyword?: string;
        issue?: string | string[];
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
    const rawIssues = params.issue
        ? Array.isArray(params.issue)
            ? params.issue
            : [params.issue]
        : [];

    const issues = [
        ...new Set(
            rawIssues.filter(
                (value) =>
                    value !== "all" &&
                    FEEDBACK_ISSUES.some((item) => item.option === value),
            ),
        ),
    ];
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
            issues,
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

    issues.forEach((value) => {
        exportParams.append("issue", value);
    });

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
            <PageHeader
                title="Phản hồi"
                subtitle="Theo dõi và xử lý phản hồi của khách hàng."
                icon={MessageCircle}
            />

            <FeedbackSummary data={summary} />

            <FeedbackToolbar
                key={`${keyword}-${issues}-${tableId}-${status}`}
                keyword={keyword}
                issues={issues}
                tableId={tableId}
                tables={tables}
                status={status}
                summary={summary}
            />

            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                    gap: 1.5,
                }}
            >
                <ExportFeedbackButton
                    href={exportUrl}
                    disabled={feedback.total === 0}
                />
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
