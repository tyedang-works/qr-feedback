"use client";

import { createTableAction } from "@/app/dashboard/tables/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import { Button, CircularProgress } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useMemo, useState } from "react";
import * as yup from "yup";

type AddTableFormValues = {
    name: string;
};

type AddTableDialogProps = {
    tableNames: string[];
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

const initialValues: AddTableFormValues = {
    name: "",
};

function createValidationSchema(tableNames: string[]) {
    const normalizedTableNames = tableNames.map((tableName) =>
        tableName.trim().toLowerCase(),
    );

    return yup.object({
        name: yup
            .string()
            .trim()
            .required("Vui lòng nhập tên bàn.")
            .test("unique-table-name", "Tên bàn này đã tồn tại.", (value) => {
                if (!value) {
                    return true;
                }

                const normalizedName = value.trim().toLowerCase();

                return !normalizedTableNames.includes(normalizedName);
            }),
    });
}

export default function AddTableDialog({ tableNames }: AddTableDialogProps) {
    const [open, setOpen] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const validationSchema = useMemo(
        () => createValidationSchema(tableNames),
        [tableNames],
    );

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleSubmit = async (
        values: AddTableFormValues,
        {
            setSubmitting,
            setFieldError,
            resetForm,
        }: FormikHelpers<AddTableFormValues>,
    ) => {
        try {
            const formData = new FormData();

            formData.append("name", values.name.trim());

            const result = await createTableAction(
                {
                    success: false,
                    message: "",
                    fieldErrors: {},
                },
                formData,
            );

            if (!result.success) {
                if (result.fieldErrors?.name) {
                    setFieldError("name", result.fieldErrors.name);

                    return;
                }

                setSnackbar({
                    open: true,
                    message:
                        result.message ||
                        "Không thể tạo bàn. Vui lòng thử lại.",
                    severity: "error",
                });

                return;
            }

            resetForm();
            setOpen(false);

            setSnackbar({
                open: true,
                message: result.message || "Đã tạo bàn thành công.",
                severity: "success",
            });
        } catch (error) {
            console.error("Failed to create table:", error);

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
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={buttonBaseSx}
            >
                + Thêm bàn
            </Button>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount={false}
                validateOnChange={false}
                validateOnBlur
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    setFieldError,
                    resetForm,
                }) => {
                    const handleClose = () => {
                        if (isSubmitting) {
                            return;
                        }

                        resetForm();
                        setOpen(false);
                    };

                    return (
                        <QRDialog
                            open={open}
                            onClose={handleClose}
                            title="Thêm bàn"
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
                                        form="add-table-form"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={buttonBaseSx}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <CircularProgress
                                                    size={16}
                                                    thickness={5}
                                                    sx={{
                                                        color: "inherit",
                                                        mr: 1,
                                                    }}
                                                />
                                                Đang thêm...
                                            </>
                                        ) : (
                                            "Thêm bàn"
                                        )}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="add-table-form" noValidate>
                                <QRTextField
                                    name="name"
                                    label="Tên bàn"
                                    placeholder="Ví dụ: Bàn 03"
                                    required
                                    value={values.name}
                                    onChange={(event) => {
                                        handleChange(event);

                                        if (errors.name) {
                                            setFieldError("name", undefined);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    errorMessage={
                                        touched.name ? errors.name : undefined
                                    }
                                />
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
