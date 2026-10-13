"use client";

import { deleteTableAction } from "@/app/dashboard/tables/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
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
                    message:
                        result.message ||
                        "Không thể xóa bàn. Vui lòng thử lại.",
                    severity: "error",
                });

                return;
            }

            resetForm();
            setOpen(false);

            setSnackbar({
                open: true,
                message: result.message || "Đã xóa bàn thành công.",
                severity: "success",
            });
        } catch (error) {
            console.error("Failed to delete table:", error);

            setOpen(false);

            setSnackbar({
                open: true,
                message: "Đã xảy ra lỗi. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Tooltip
                title={
                    disabled
                        ? "Không thể xóa bàn đã có phản hồi. Vui lòng tắt bàn."
                        : ""
                }
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
                        sx={{
                            minWidth: 50,
                            height: 36,
                            px: 1,
                            borderRadius: 1.5,
                            color: "#d92d20",
                            fontSize: 13,
                            fontWeight: 600,
                            textTransform: "none",

                            "&:hover": {
                                backgroundColor: "#fef3f2",
                            },
                        }}
                    >
                        Xóa
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
                            title="Xóa bàn"
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
                                        Hủy
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
                                            ? "Đang xóa..."
                                            : "Xóa bàn"}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="delete-table-form" noValidate>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                        color: "#344054",
                                    }}
                                >
                                    Bạn có chắc muốn xóa bàn{" "}
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#193B56",
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
                                        color: "#667085",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Bàn chỉ có thể xóa nếu chưa có phản hồi.
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
