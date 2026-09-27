import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserContext } from "@/lib/auth/queries";
import { FEEDBACK_PAGE_SIZE } from "@/lib/feedback/constants";
import { getFeedbackList } from "@/lib/feedback/queries";
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

export default async function FeedbackPage() {
    const userContext = await getUserContext();

    const feedback = userContext
        ? await getFeedbackList(
            userContext.restaurantId,
            {
                page: 1,
                pageSize: FEEDBACK_PAGE_SIZE,
                keyword: "",
                issue: "",
                tableId: "",
            },
        )
        : {
            data: [],
            total: 0,
            page: 1,
            pageSize: FEEDBACK_PAGE_SIZE,
            totalPages: 0,
        };

    return (
        <DashboardLayout>
            <Stack sx={{ gap: 3 }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: 26,
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

                <Box>
                    <Typography>
                        Total: {feedback.total}
                    </Typography>
                </Box>
            </Stack>
        </DashboardLayout>
    );
}