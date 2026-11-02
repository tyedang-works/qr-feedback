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

import { useTranslation } from "@/components/common/providers/useTranslation";
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

export default function ChangePasswordDialog({
    open,
    onClose,
}: ChangePasswordDialogProps) {
    const { t } = useTranslation();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const validationSchema = yup.object({
        currentPassword: yup.string().required(" "),

        newPassword: yup
            .string()
            .required(" ")
            .min(8, t("profile", "passwordMinLength"))
            .max(72, t("profile", "passwordMaxLength"))
            .test(
                "different-password",
                t("profile", "passwordMustBeDifferent"),
                (value, context) =>
                    !value || value !== context.parent.currentPassword,
            ),

        confirmPassword: yup
            .string()
            .required(" ")
            .oneOf([yup.ref("newPassword")], t("profile", "passwordMismatch")),
    });

    const handleCloseSnackbar = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const resetPasswordVisibility = () => {
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = (resetForm?: () => void) => {
        resetForm?.();
        resetPasswordVisibility();
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
                    message: t("profile", "sessionExpired"),
                    severity: "error",
                });
                return;
            }

            // Verify the current password before updating it.
            const { error: verifyError } =
                await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: values.currentPassword,
                });

            if (verifyError) {
                setSnackbar({
                    open: true,
                    message: t("profile", "currentPasswordIncorrect"),
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
                    message: t("profile", "changePasswordError"),
                    severity: "error",
                });
                return;
            }

            resetForm();
            resetPasswordVisibility();
            onClose();

            setSnackbar({
                open: true,
                message: t("profile", "changePasswordSuccess"),
                severity: "success",
            });
        } catch (error) {
            console.error("Failed to change password:", error);

            setSnackbar({
                open: true,
                message: t("profile", "unexpectedError"),
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
                aria-label={
                    visible
                        ? t("profile", "hidePassword")
                        : t("profile", "showPassword")
                }
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
                                    handleClose(resetForm);
                                }
                            }}
                            title={t("profile", "changePasswordTitle")}
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        disabled={isBusy}
                                        onClick={() => handleClose(resetForm)}
                                        sx={buttonBaseCancelSx}
                                    >
                                        {t("profile", "cancel")}
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
                                                {t("profile", "updating")}
                                            </>
                                        ) : (
                                            t("profile", "changePassword")
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
                                        label={t(
                                            "profile",
                                            "currentPasswordLabel",
                                        )}
                                        placeholder={t(
                                            "profile",
                                            "currentPasswordPlaceholder",
                                        )}
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
                                        label={t("profile", "newPasswordLabel")}
                                        placeholder={t(
                                            "profile",
                                            "newPasswordPlaceholder",
                                        )}
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
                                        label={t(
                                            "profile",
                                            "confirmPasswordLabel",
                                        )}
                                        placeholder={t(
                                            "profile",
                                            "confirmPasswordPlaceholder",
                                        )}
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
