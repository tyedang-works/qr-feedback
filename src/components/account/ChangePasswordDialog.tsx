"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { useState } from "react";
import * as yup from "yup";

import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";

import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";
import { createClient } from "@/lib/supabase/browser";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import { Eye, EyeOff } from "lucide-react";

type ChangePasswordDialogProps = {
    open: boolean;
    onClose: () => void;
};

type FormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

const initialValues: FormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const validationSchema = yup.object({
    currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại."),
    newPassword: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới.")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
        .max(72, "Mật khẩu không được vượt quá 72 ký tự.")
        .test(
            "different-password",
            "Mật khẩu mới phải khác mật khẩu hiện tại.",
            (value, context) =>
                !value || value !== context.parent.currentPassword,
        ),
    confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu mới.")
        .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp."),
});

export default function ChangePasswordDialog({
    open,
    onClose,
}: ChangePasswordDialogProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleClose = (_values?: FormValues, resetForm?: () => void) => {
        resetForm?.();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, resetForm }: FormikHelpers<FormValues>,
    ) => {
        try {
            const supabase = createClient();

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user?.email) {
                setSnackbar({
                    open: true,
                    message:
                        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                    severity: "error",
                });
                return;
            }

            const { error: verifyError } =
                await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: values.currentPassword,
                });

            if (verifyError) {
                setSnackbar({
                    open: true,
                    message: "Mật khẩu hiện tại không chính xác.",
                    severity: "error",
                });
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: values.newPassword,
            });

            if (updateError) {
                setSnackbar({
                    open: true,
                    message: "Không thể đổi mật khẩu. Vui lòng thử lại.",
                    severity: "error",
                });
                return;
            }

            resetForm();
            handleClose();

            setSnackbar({
                open: true,
                message: "Đổi mật khẩu thành công.",
                severity: "success",
            });
        } catch (error) {
            console.error("Failed to change password:", error);

            setSnackbar({
                open: true,
                message: "Đã xảy ra lỗi. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const passwordAdornment = (
        visible: boolean,
        onToggle: () => void,
        disabled: boolean,
    ) => (
        <InputAdornment position="end">
            <IconButton
                type="button"
                edge="end"
                size="small"
                disabled={disabled}
                aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={onToggle}
            >
                {visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </IconButton>
        </InputAdornment>
    );

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldError,
                    isSubmitting,
                    resetForm,
                }) => {
                    const isBusy = isSubmitting;

                    const clearFieldError = (field: keyof FormValues) => {
                        if (errors[field]) {
                            setFieldError(field, undefined);
                        }
                    };

                    return (
                        <QRDialog
                            open={open}
                            onClose={() => {
                                if (!isBusy) {
                                    handleClose(values, resetForm);
                                }
                            }}
                            title="Đổi mật khẩu"
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        disabled={isBusy}
                                        onClick={() =>
                                            handleClose(values, resetForm)
                                        }
                                        sx={buttonBaseCancelSx}
                                    >
                                        Hủy
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        form="change-password-form"
                                        disabled={isBusy}
                                        sx={buttonBaseSx}
                                    >
                                        {isBusy ? (
                                            <>
                                                <CircularProgress
                                                    size={16}
                                                    thickness={5}
                                                    sx={{
                                                        color: "inherit",
                                                        mr: 1,
                                                    }}
                                                />
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            "Đổi mật khẩu"
                                        )}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="change-password-form" noValidate>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2.5,
                                    }}
                                >
                                    <QRTextField
                                        name="currentPassword"
                                        label="Mật khẩu hiện tại"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        required
                                        value={values.currentPassword}
                                        onChange={(event) => {
                                            handleChange(event);
                                            clearFieldError("currentPassword");
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isBusy}
                                        errorMessage={
                                            touched.currentPassword
                                                ? errors.currentPassword
                                                : undefined
                                        }
                                        slotProps={{
                                            input: {
                                                endAdornment: passwordAdornment(
                                                    showCurrentPassword,
                                                    () =>
                                                        setShowCurrentPassword(
                                                            (previous) =>
                                                                !previous,
                                                        ),
                                                    isBusy,
                                                ),
                                            },
                                        }}
                                    />

                                    <QRTextField
                                        name="newPassword"
                                        label="Mật khẩu mới"
                                        placeholder="Nhập mật khẩu mới"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        value={values.newPassword}
                                        onChange={(event) => {
                                            handleChange(event);
                                            clearFieldError("newPassword");
                                            clearFieldError("confirmPassword");
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isBusy}
                                        errorMessage={
                                            touched.newPassword
                                                ? errors.newPassword
                                                : undefined
                                        }
                                        slotProps={{
                                            input: {
                                                endAdornment: passwordAdornment(
                                                    showNewPassword,
                                                    () =>
                                                        setShowNewPassword(
                                                            (previous) =>
                                                                !previous,
                                                        ),
                                                    isBusy,
                                                ),
                                            },
                                        }}
                                    />

                                    <QRTextField
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu mới"
                                        placeholder="Nhập lại mật khẩu mới"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        value={values.confirmPassword}
                                        onChange={(event) => {
                                            handleChange(event);
                                            clearFieldError("confirmPassword");
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isBusy}
                                        errorMessage={
                                            touched.confirmPassword
                                                ? errors.confirmPassword
                                                : undefined
                                        }
                                        slotProps={{
                                            input: {
                                                endAdornment: passwordAdornment(
                                                    showConfirmPassword,
                                                    () =>
                                                        setShowConfirmPassword(
                                                            (previous) =>
                                                                !previous,
                                                        ),
                                                    isBusy,
                                                ),
                                            },
                                        }}
                                    />
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
                onClose={handleCloseSnackbar}
            />
        </>
    );
}
