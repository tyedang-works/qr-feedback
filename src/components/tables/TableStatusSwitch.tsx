"use client";

import { useState } from "react";

import {
    Box,
    Switch,
    Typography,
} from "@mui/material";

import { updateTableStatusAction } from "@/app/dashboard/tables/actions";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import { getTableStatusLabelSx, tableStatusSwitchSx } from "@/styles/table.styles";

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

type TableStatusSwitchProps = {
    tableId: string;
    isActive: boolean;
};

export default function TableStatusSwitch({
    tableId,
    isActive,
}: TableStatusSwitchProps) {
    const [checked, setChecked] = useState(isActive);

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.checked;
        const previousValue = checked;

        setChecked(nextValue);
        setLoading(true);

        try {
            const result =
                await updateTableStatusAction(
                    tableId,
                    nextValue,
                );

            if (!result.success) {
                setChecked(previousValue);

                setSnackbar({
                    open: true,
                    message:
                        result.message ||
                        "Không thể cập nhật trạng thái bàn.",
                    severity: "error",
                });

                return;
            }

            setSnackbar({
                open: true,
                message: nextValue
                    ? "Đã bật bàn thành công."
                    : "Đã tắt bàn thành công.",
                severity: "success",
            });
        } catch (error) {
            console.error(
                "Failed to update table status:",
                error,
            );

            setChecked(previousValue);

            setSnackbar({
                open: true,
                message:
                    "Đã xảy ra lỗi. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                }}
            >
                <Switch
                    checked={checked}
                    onChange={handleChange}
                    disabled={loading}
                    slotProps={{
                        input: {
                            "aria-label": checked
                                ? "Tắt bàn"
                                : "Bật bàn",
                        },
                    }}
                    sx={tableStatusSwitchSx} />

                <Typography
                    sx={getTableStatusLabelSx(checked)}
                >
                    {checked
                        ? "Đang hoạt động"
                        : "Đã tắt"}
                </Typography>
            </Box>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false,
                    }))
                }
            />
        </>
    );
}