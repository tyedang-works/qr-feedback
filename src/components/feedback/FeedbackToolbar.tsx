import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { FEEDBACK_ISSUES, FEEDBACK_STATUS } from "@/lib/feedback/constants";
import type { RestaurantTableOption } from "@/lib/tables/queries";
import { Box, Button, MenuItem, Stack } from "@mui/material";

type FeedbackToolbarProps = {
    keyword: string;
    issue: string;
    tableId: string;
    status: string;
    tables: RestaurantTableOption[];
};

const STATUS_OPTIONS = [
    { value: FEEDBACK_STATUS.NEW, label: "Chưa xử lý" },
    { value: FEEDBACK_STATUS.IN_PROGRESS, label: "Đang xử lý" },
    { value: FEEDBACK_STATUS.RESOLVED, label: "Đã xử lý" },
] as const;

const FILTER_WIDTHS = {
    issue: { xs: "100%", md: 220 },
    table: { xs: "100%", md: 170 },
    status: { xs: "100%", md: 180 },
} as const;

const selectSx = {
    height: 40,
    fontSize: 14,
};

export default function FeedbackToolbar({
    keyword,
    issue,
    tableId,
    status,
    tables,
}: FeedbackToolbarProps) {
    return (
        <Box
            component="form"
            method="get"
            sx={{
                p: 1.5,
                backgroundColor: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
            }}
        >
            <Stack
                sx={{
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        marginTop: { xs: 0, md: "24px" },
                    }}
                >
                    <QRTextField
                        name="keyword"
                        placeholder="Tìm kiếm phản hồi..."
                        defaultValue={keyword}
                    />
                </Box>

                <Box
                    sx={{
                        width: FILTER_WIDTHS.issue,
                        flexShrink: 0,
                    }}
                >
                    <QRSelect
                        name="issue"
                        label="Vấn đề"
                        defaultValue={issue || "all"}
                        sx={selectSx}
                    >
                        <MenuItem value="all">All</MenuItem>

                        {FEEDBACK_ISSUES.map(({ option, label }) => (
                            <MenuItem key={option} value={option}>
                                {label}
                            </MenuItem>
                        ))}
                    </QRSelect>
                </Box>

                <Box
                    sx={{
                        width: FILTER_WIDTHS.table,
                        flexShrink: 0,
                    }}
                >
                    <QRSelect
                        name="tableId"
                        label="Bàn"
                        defaultValue={tableId || "all"}
                        sx={selectSx}
                    >
                        <MenuItem value="all">All</MenuItem>

                        {tables.map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                    </QRSelect>
                </Box>

                <Box
                    sx={{
                        width: FILTER_WIDTHS.status,
                        flexShrink: 0,
                    }}
                >
                    <QRSelect
                        name="status"
                        label="Trạng thái"
                        defaultValue={status || "all"}
                        sx={selectSx}
                    >
                        <MenuItem value="all">Tất cả trạng thái</MenuItem>

                        {STATUS_OPTIONS.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </QRSelect>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        width: { xs: "100%", md: "auto" },
                        minWidth: { md: 100 },
                        height: 40,
                        px: 2.5,
                        borderRadius: 1.5,
                        backgroundColor: "#1976d2",
                        fontSize: 14,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "none",
                        flexShrink: 0,
                        marginTop: { xs: "10px", md: "24px" },
                        "&:hover": {
                            backgroundColor: "#1565c0",
                            boxShadow: "none",
                        },
                    }}
                >
                    Tìm kiếm
                </Button>
            </Stack>
        </Box>
    );
}
