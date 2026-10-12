import {
    faCircleCheck,
    faCirclePause,
    faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";

import type { RestaurantTableSummary } from "@/lib/tables/queries";

type TablesSummaryProps = {
    data: RestaurantTableSummary;
};

const summaryItems = [
    {
        key: "total",
        label: "Tổng số bàn",
        icon: faTableCellsLarge,
        iconColor: "#193B56",
        iconBackground: "#dceaf4",
        backgroundColor: "#f5f9fc",
        borderColor: "#e0eaf2",
    },
    {
        key: "active",
        label: "Đang hoạt động",
        icon: faCircleCheck,
        iconColor: "#067647",
        iconBackground: "#d1fadf",
        backgroundColor: "#f3fcf6",
        borderColor: "#d9f0e1",
    },
    {
        key: "inactive",
        label: "Đã tắt",
        icon: faCirclePause,
        iconColor: "#c2410c",
        iconBackground: "#ffead5",
        backgroundColor: "#fff9f3",
        borderColor: "#f5e7d8",
    },
] as const;

export default function TablesSummary({ data }: TablesSummaryProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
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
                        gap: 2,
                        minWidth: 0,
                        backgroundColor: item.backgroundColor,
                        border: `1px solid ${item.borderColor}`,
                        borderRadius: 2,
                        px: { xs: 2, sm: 2.5 },
                        py: { xs: 2, sm: 2.5 },
                        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#667085",
                                lineHeight: 1.5,
                            }}
                        >
                            {item.label}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: { xs: 26, sm: 30 },
                                lineHeight: 1.2,
                                fontWeight: 700,
                                color: "#193B56",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {data[item.key]}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 46,
                            height: 46,
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
                            style={{ fontSize: 21 }}
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
