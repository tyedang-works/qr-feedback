import {
    faCircleCheck,
    faClock,
    faInbox,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";

import type { FeedbackSummary as FeedbackSummaryData } from "@/lib/feedback/types";

type FeedbackSummaryProps = {
    data: FeedbackSummaryData;
};

const summaryItems = [
    {
        key: "total",
        label: "Tổng phản hồi",
        description: "Tất cả phản hồi",
        icon: faInbox,
        iconColor: "#193B56",
        iconBackground: "#F0F5F9",
        accentColor: "#D8E5EF",
    },
    {
        key: "new",
        label: "Chưa xử lý",
        description: "Cần được tiếp nhận",
        icon: faClock,
        iconColor: "#B54708",
        iconBackground: "#FFF5E9",
        accentColor: "#F3DEC5",
    },
    {
        key: "inProgress",
        label: "Đang xử lý",
        description: "Đang được giải quyết",
        icon: faSpinner,
        iconColor: "#175CD3",
        iconBackground: "#EFF6FF",
        accentColor: "#D8E7FC",
    },
    {
        key: "resolved",
        label: "Đã xử lý",
        description: "Đã hoàn tất",
        icon: faCircleCheck,
        iconColor: "#027A48",
        iconBackground: "#ECF8F0",
        accentColor: "#D5EBDD",
    },
] as const;

export default function FeedbackSummary({ data }: FeedbackSummaryProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.25, sm: 1.75 },
                width: "100%",
            }}
        >
            {summaryItems.map((item) => (
                <Box
                    key={item.key}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                        minWidth: 0,
                        p: { xs: 1.75, sm: 2.25 },
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #EAECF0",
                        borderRadius: 2,
                    }}
                >
                    <Stack sx={{ minWidth: 0, gap: 0.5 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: 12, sm: 13 },
                                lineHeight: 1.5,
                                fontWeight: 500,
                                color: "#667085",
                            }}
                        >
                            {item.label}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: { xs: 25, sm: 29 },
                                lineHeight: 1.2,
                                fontWeight: 700,
                                letterSpacing: "-0.5px",
                                color: "#193B56",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {data[item.key]}
                        </Typography>

                        <Typography
                            sx={{
                                display: { xs: "none", sm: "block" },
                                fontSize: 12,
                                lineHeight: 1.5,
                                color: "#98A2B3",
                            }}
                        >
                            {item.description}
                        </Typography>
                    </Stack>

                    <Box
                        sx={{
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            backgroundColor: item.iconBackground,
                            color: item.iconColor,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            style={{ fontSize: 17 }}
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
