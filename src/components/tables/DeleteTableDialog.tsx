"use client";

import { deleteTableAction } from "@/app/dashboard/tables/actions";
import { useTranslation } from "@/components/common/providers/useTranslation";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import {
    buttonBaseCancelSx,
    buttonBaseSx,
    tableDeleteButtonSx,
} from "@/styles/button.styles";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useState } from "react";

type DeleteTableDialogProps = {
    tableId: string;
    tableName: string;
    disabled?: boolean;
};

type DeleteTableFormValues = {
    tableId: string;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

export default function DeleteTableDialog({
    tableId,
    tableName,
    disabled,
}: DeleteTableDialogProps) {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const initialValues: DeleteTableFormValues = {
        tableId,
    };

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleSubmit = async (
        values: DeleteTableFormValues,
        { setSubmitting, resetForm }: FormikHelpers<DeleteTableFormValues>,
    ) => {
        try {
            const formData = new FormData();

            formData.append("tableId", values.tableId);

            const result = await deleteTableAction(
                {
                    success: false,
                    message: "",
                    fieldErrors: {},
                },
                formData,
            );

            if (!result.success) {
                setOpen(false);

                setSnackbar({
                    open: true,
                    message: result.message || t("table", "deleteTableFailed"),
                    severity: "error",
                });

                return;
            }

            resetForm();
            setOpen(false);

            setSnackbar({
                open: true,
                message: t("table", "deleteTableSuccess"),
                severity: "success",
            });
        } catch (error) {
            console.error("Failed to delete table:", error);

            setOpen(false);

            setSnackbar({
                open: true,
                message: t("table", "deleteTableError"),
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Tooltip
                title={disabled ? t("table", "cannotDeleteTableTooltip") : ""}
                placement="top"
                arrow
                slotProps={{
                    tooltip: {
                        sx: {
                            maxWidth: 260,
                            fontSize: 12,
                            lineHeight: 1.4,
                        },
                    },
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: "inline-flex",
                    }}
                >
                    <Button
                        type="button"
                        disabled={disabled}
                        onClick={() => setOpen(true)}
                        sx={tableDeleteButtonSx}
                    >
                        {t("table", "deleteTable")}
                    </Button>
                </Box>
            </Tooltip>

            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => {
                    const handleClose = () => {
                        if (isSubmitting) {
                            return;
                        }

                        setOpen(false);
                    };

                    return (
                        <QRDialog
                            open={open}
                            onClose={handleClose}
                            title={t("table", "deleteTableTitle")}
                            maxWidth="xs"
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        sx={buttonBaseCancelSx}
                                    >
                                        {t("table", "cancel")}
                                    </Button>

                                    <Button
                                        type="submit"
                                        form="delete-table-form"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={{
                                            ...buttonBaseSx,
                                            backgroundColor: "#d92d20",
                                            "&:hover": {
                                                backgroundColor: "#b42318",
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        {isSubmitting
                                            ? t("table", "deleting")
                                            : t("table", "confirmDeleteTable")}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="delete-table-form" noValidate>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {t("table", "deleteTableConfirmation")}{" "}
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        {tableName}
                                    </Typography>
                                    ?
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        color: "var(--color-text-secondary)",
                                        fontStyle: "italic",
                                    }}
                                >
                                    {t("table", "deleteTableWarning")}
                                </Typography>
                            </Form>
                        </QRDialog>
                    );
                }}
            </Formik>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />
        </>
    );
}
