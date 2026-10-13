"use client";

import { Box, Button, CircularProgress, MenuItem } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import { addUserAction } from "@/app/dashboard/users-roles/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";

import { USER_ROLE_OPTIONS } from "@/lib/auth/constants";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QRSnackbar from "../common/feedback/QRSnackbar";

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

type AddUserDialogProps = {
    open: boolean;
    onClose: () => void;
};

type AddUserFormValues = {
    fullName: string;
    email: string;
    role: string;
};

const initialValues: AddUserFormValues = {
    fullName: "",
    email: "",
    role: "",
};

const validationSchema = yup.object({
    fullName: yup.string().trim().required("Vui lòng nhập tên."),
    email: yup
        .string()
        .trim()
        .email("Email không hợp lệ.")
        .required("Vui lòng nhập email."),

    role: yup.string().required("Vui lòng chọn role."),
});

export default function AddUserDialog({ open, onClose }: AddUserDialogProps) {
    const router = useRouter();
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };
    const handleSubmit = async (
        values: AddUserFormValues,
        {
            setSubmitting,
            setFieldError,
            resetForm,
        }: FormikHelpers<AddUserFormValues>,
    ) => {
        try {
            const result = await addUserAction({
                fullName: values.fullName,
                email: values.email,
                role: values.role,
            });

            if (!result.success) {
                const hasFieldErrors =
                    Boolean(result.fieldErrors?.fullName) ||
                    Boolean(result.fieldErrors?.email) ||
                    Boolean(result.fieldErrors?.role);
                if (result.fieldErrors?.fullName) {
                    setFieldError("fullName", result.fieldErrors.fullName);
                }

                if (result.fieldErrors?.email) {
                    setFieldError("email", result.fieldErrors.email);
                }

                if (result.fieldErrors?.role) {
                    setFieldError("role", result.fieldErrors.role);
                }

                if (!hasFieldErrors) {
                    setSnackbar({
                        open: true,
                        message: result.message || "Không thể thêm người dùng.",
                        severity: "error",
                    });
                }

                return;
            }

            resetForm();
            onClose();

            setSnackbar({
                open: true,
                message: result.message || "Đã thêm người dùng thành công.",
                severity: "success",
            });

            router.refresh();
        } catch (error) {
            console.error("Failed to add user:", error);

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
                        onClose();
                    };

                    return (
                        <QRDialog
                            open={open}
                            onClose={handleClose}
                            title="Thêm người dùng"
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
                                        form="add-user-form"
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
                                                Đang lưu...
                                            </>
                                        ) : (
                                            "Lưu"
                                        )}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="add-user-form" noValidate>
                                <Box
                                    component="div"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <QRTextField
                                        name="fullName"
                                        label="Tên"
                                        placeholder="Nhập tên người dùng"
                                        required
                                        value={values.fullName}
                                        onChange={(event) => {
                                            handleChange(event);

                                            if (errors.fullName) {
                                                setFieldError(
                                                    "fullName",
                                                    undefined,
                                                );
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        errorMessage={
                                            touched.fullName
                                                ? errors.fullName
                                                : undefined
                                        }
                                    />

                                    <QRTextField
                                        name="email"
                                        label="Email"
                                        placeholder="Nhập email"
                                        type="email"
                                        required
                                        value={values.email}
                                        onChange={(event) => {
                                            handleChange(event);

                                            if (errors.email) {
                                                setFieldError(
                                                    "email",
                                                    undefined,
                                                );
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        errorMessage={
                                            touched.email
                                                ? errors.email
                                                : undefined
                                        }
                                    />

                                    <QRSelect
                                        name="role"
                                        label="Role"
                                        required
                                        value={values.role}
                                        onChange={(event) => {
                                            handleChange(event);

                                            if (errors.role) {
                                                setFieldError(
                                                    "role",
                                                    undefined,
                                                );
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        errorMessage={
                                            touched.role
                                                ? errors.role
                                                : undefined
                                        }
                                    >
                                        {USER_ROLE_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </QRSelect>
                                </Box>
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
