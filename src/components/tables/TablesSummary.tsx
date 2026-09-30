import { Box, Typography } from "@mui/material";

import type { RestaurantTableSummary } from "@/lib/tables/queries";

type TablesSummaryProps = {
    data: RestaurantTableSummary;
};

const summaryItems = [
    {
        key: "total",
        label: "Tổng số bàn",
    },
    {
        key: "active",
        label: "Đang hoạt động",
    },
    {
        key: "inactive",
        label: "Đã tắt",
    },
] as const;

export default function TablesSummary({ data }: TablesSummaryProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                },
                gap: 2,
                width: "100%",
            }}
        >
            {summaryItems.map((item) => (
                <Box
                    key={item.key}
                    sx={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #eaecf0",
                        borderRadius: 2,
                        px: { xs: 2, sm: 2.5 },
                        py: { xs: 2, sm: 2.25 },
                        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#667085",
                        }}
                    >
                        {item.label}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.75,
                            fontSize: {
                                xs: 24,
                                sm: 28,
                            },
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        {data[item.key]}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
