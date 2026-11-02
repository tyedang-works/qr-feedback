"use client";

import { useState } from "react";
import { Box, CircularProgress, Switch, Typography } from "@mui/material";
import { updateTableStatusAction } from "@/app/dashboard/tables/actions";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import { useTranslation } from "@/components/common/providers/useTranslation";
import {
    getTableStatusLabelSx,
    tableStatusSwitchSx,
} from "@/styles/table.styles";

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

type TableStatusSwitchProps = {
    tableId: string;
    isActive: boolean;
    canManageTables: boolean;
};

export default function TableStatusSwitch({
    tableId,
    isActive,
    canManageTables,
}: TableStatusSwitchProps) {
    const { t } = useTranslation();

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
            const result = await updateTableStatusAction(tableId, nextValue);

            if (!result.success) {
                setChecked(previousValue);

                setSnackbar({
                    open: true,
                    message:
                        result.message || t("table", "updateTableStatusFailed"),
                    severity: "error",
                });

                return;
            }

            setSnackbar({
                open: true,
                message: t(
                    "table",
                    nextValue
                        ? "activateTableSuccess"
                        : "deactivateTableSuccess",
                ),
                severity: "success",
            });
        } catch {
            setChecked(previousValue);
            setSnackbar({
                open: true,
                message: t("table", "updateTableStatusError"),
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
                <Box
                    sx={{
                        position: "relative",
                        width: 38,
                        height: 22,
                        flexShrink: 0,
                    }}
                >
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                        disabled={loading || !canManageTables}
                        slotProps={{
                            input: {
                                "aria-label": t(
                                    "table",
                                    checked
                                        ? "deactivateTable"
                                        : "activateTable",
                                ),
                            },
                        }}
                        sx={tableStatusSwitchSx}
                    />

                    {loading && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                            }}
                        >
                            <CircularProgress
                                size={12}
                                thickness={5}
                                sx={{
                                    color: "var(--color-text-primary, #FFFFFF)",
                                }}
                            />
                        </Box>
                    )}
                </Box>

                <Typography sx={getTableStatusLabelSx(checked)}>
                    {t(
                        "table",
                        checked ? "tableStatusActive" : "tableStatusInactive",
                    )}
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
