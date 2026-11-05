import PageHeader from "@/components/common/layout/PageHeader";
import FeedbackList from "@/components/feedback/FeedbackList";
import FeedbackPagination from "@/components/feedback/FeedbackPagination";
import FeedbackToolbar from "@/components/feedback/FeedbackToolbar";
import { translations, type Locale } from "@/i18n/translations";
import { USER_ROLES } from "@/lib/auth/constants";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_ISSUES, FEEDBACK_PAGE_SIZE } from "@/lib/feedback/constants";
import { getFeedbackList, getFeedbackSummary } from "@/lib/feedback/queries";
import { getRestaurantTables } from "@/lib/tables/queries";
import { Stack } from "@mui/material";
import { MessageCircle } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FeedbackPageProps = {
    searchParams: Promise<{
        keyword?: string;
        issue?: string | string[];
        tableId?: string | string[];
        status?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
        page?: string;
    }>;
};

export default async function FeedbackPage({
    searchParams,
}: FeedbackPageProps) {
    const params = await searchParams;
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("qr-locale")?.value;

    const locale: Locale =
        cookieLocale && cookieLocale in translations
            ? (cookieLocale as Locale)
            : "vi";

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

    const rawTableIds = params.tableId
        ? Array.isArray(params.tableId)
            ? params.tableId
            : [params.tableId]
        : [];

    const tableIds = [...new Set(rawTableIds.filter(Boolean))];

    const status =
        params.status && params.status !== "all" ? params.status : "";

    const startDate = params.startDate ?? "";
    const endDate = params.endDate ?? "";

    const sort = params.sort === "oldest" ? "oldest" : "newest";

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
            tableIds,
            status,
            startDate,
            endDate,
            sort,
        }),
        getRestaurantTables(userContext.restaurantId),
        getFeedbackSummary(userContext.restaurantId),
    ]);

    const exportParams = new URLSearchParams();
    exportParams.set("locale", locale);
    if (keyword) {
        exportParams.set("keyword", keyword);
    }

    issues.forEach((value) => {
        exportParams.append("issue", value);
    });

    tableIds.forEach((value) => {
        exportParams.append("tableId", value);
    });

    if (status) {
        exportParams.set("status", status);
    }

    if (startDate) {
        exportParams.set("startDate", startDate);
    }

    if (endDate) {
        exportParams.set("endDate", endDate);
    }

    if (sort !== "newest") {
        exportParams.set("sort", sort);
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
                title={translations[locale].navigation.feedback}
                subtitle={
                    translations[locale].dashboard.feedbackPageDescription
                }
                icon={MessageCircle}
            />

            <FeedbackToolbar
                key={JSON.stringify({
                    keyword,
                    issues,
                    tableIds,
                    status,
                    startDate,
                    endDate,
                    sort,
                })}
                keyword={keyword}
                issues={issues}
                tableIds={tableIds}
                status={status}
                startDate={startDate}
                endDate={endDate}
                sort={sort}
                tables={tables}
                total={feedback.total}
                exportUrl={exportUrl}
                exportDisabled={feedback.total === 0}
                summary={summary}
            />

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
