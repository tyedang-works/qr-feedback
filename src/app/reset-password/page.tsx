"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Typography,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import Logo from "@/components/common/Logo";
import QRTextField from "@/components/common/input/QRTextField";
import { createClient } from "@/lib/supabase/browser";
import { loginButtonSx, loginTextFieldSx } from "@/styles/login.styles";

type ResetPasswordValues = {
    password: string;
    confirmPassword: string;
};

const initialValues: ResetPasswordValues = {
    password: "",
    confirmPassword: "",
};

const validationSchema = Yup.object({
    password: Yup.string()
        .required(" ")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
    confirmPassword: Yup.string()
        .required(" ")
        .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp."),
});

const COLORS = {
    background: "#ffffff",
    surface: "#ffffff",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    border: "#e5e7eb",
    primary: "#193b56",
    success: "#39745c",
    successBackground: "#eaf2ed",
    successBorder: "#cfe0d5",
    error: "#d92d20",
};

type RecoveryState = "checking" | "valid" | "invalid";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [recoveryState, setRecoveryState] =
        useState<RecoveryState>("checking");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        let active = true;
        let recoveryEventReceived = false;
        let verificationTimer: ReturnType<typeof setTimeout> | undefined;

        const hasRecoveryMarker = (() => {
            const hashParams = new URLSearchParams(
                window.location.hash.slice(1),
            );
            const searchParams = new URLSearchParams(window.location.search);

            return (
                hashParams.get("type") === "recovery" ||
                searchParams.get("type") === "recovery"
            );
        })();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!active) return;

            if (event === "PASSWORD_RECOVERY" && session) {
                recoveryEventReceived = true;

                if (verificationTimer) {
                    clearTimeout(verificationTimer);
                }

                setRecoveryState("valid");
            }
        });

        const verifyRecoverySession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (!active || recoveryEventReceived) return;

                if (error || !session) {
                    setRecoveryState("invalid");
                    return;
                }

                if (hasRecoveryMarker) {
                    setRecoveryState("valid");
                    return;
                }

                verificationTimer = setTimeout(() => {
                    if (active && !recoveryEventReceived) {
                        setRecoveryState("invalid");
                    }
                }, 500);
            } catch {
                if (active && !recoveryEventReceived) {
                    setRecoveryState("invalid");
                }
            }
        };

        void verifyRecoverySession();

        return () => {
            active = false;

            if (verificationTimer) {
                clearTimeout(verificationTimer);
            }

            subscription.unsubscribe();
        };
    }, []);

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
                sx={{
                    color: COLORS.textSecondary,
                    "&:hover": {
                        backgroundColor: "rgba(25, 59, 86, 0.06)",
                    },
                }}
            >
                {visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </IconButton>
        </InputAdornment>
    );

    const handleSubmit = async (
        values: ResetPasswordValues,
        { setSubmitting, setStatus }: FormikHelpers<ResetPasswordValues>,
    ) => {
        setStatus(undefined);
        if (recoveryState !== "valid") {
            setRecoveryState("invalid");
            setSubmitting(false);
            return;
        }
        const supabase = createClient();

        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                setRecoveryState("invalid");
                return;
            }

            const { error } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (error) {
                if (error.code === "same_password") {
                    setStatus(
                        "Mật khẩu mới phải khác mật khẩu hiện tại. Vui lòng nhập mật khẩu khác.",
                    );
                    return;
                }

                if (
                    error.code === "weak_password" ||
                    error.code === "password_too_short"
                ) {
                    setStatus(
                        "Mật khẩu chưa đáp ứng yêu cầu bảo mật. Vui lòng chọn mật khẩu mạnh hơn.",
                    );
                    return;
                }

                if (
                    error.code === "session_not_found" ||
                    error.code === "refresh_token_not_found" ||
                    error.code === "otp_expired"
                ) {
                    setRecoveryState("invalid");
                    return;
                }

                setStatus(
                    "Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu liên kết mới.",
                );
                return;
            }
            const email = session.user.email;

            if (email) {
                sessionStorage.setItem("reset-password-email", email);
            }
            setResetSuccess(true);

            try {
                const { error: signOutError } = await supabase.auth.signOut();

                if (signOutError) {
                    console.error(
                        "Sign out after password reset failed:",
                        signOutError.message,
                    );
                }
            } catch (signOutError) {
                console.error(
                    "Sign out after password reset failed:",
                    signOutError,
                );
            }
        } catch {
            setStatus("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100dvh",
                px: 2.5,
                py: 4,
                backgroundColor: COLORS.background,
                color: COLORS.textPrimary,
                colorScheme: "light",
                "&, & *": { boxSizing: "border-box" },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    p: { xs: 3, sm: 4 },
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 3,
                    backgroundColor: COLORS.surface,
                    boxShadow:
                        "0 2px 4px rgba(16,24,40,0.02), 0 12px 32px rgba(16,24,40,0.07)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 4,
                    }}
                >
                    <Logo height="50px" width="50px" />

                    <Typography
                        component="span"
                        sx={{
                            fontSize: 20,
                            fontWeight: 700,
                            letterSpacing: "-0.4px",
                        }}
                    >
                        QR Feedback
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        component="h1"
                        sx={{
                            mb: 1,
                            fontSize: { xs: 22, sm: 26 },
                            lineHeight: 1.3,
                            fontWeight: 700,
                            letterSpacing: "-0.6px",
                        }}
                    >
                        Đặt lại mật khẩu
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.7,
                            color: COLORS.textSecondary,
                        }}
                    >
                        Tạo mật khẩu mới để tiếp tục sử dụng QR Feedback.
                    </Typography>
                </Box>

                {recoveryState === "checking" ? (
                    <Typography
                        role="status"
                        sx={{
                            py: 3,
                            fontSize: 13,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                        }}
                    >
                        Đang xác minh liên kết khôi phục...
                    </Typography>
                ) : resetSuccess ? (
                    <Box>
                        <Box
                            role="status"
                            aria-live="polite"
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.25,
                                p: 1.75,
                                mb: 2.5,
                                border: `1px solid ${COLORS.successBorder}`,
                                borderRadius: 2,
                                backgroundColor: COLORS.successBackground,
                                color: COLORS.success,
                            }}
                        >
                            <CheckCircle2
                                size={20}
                                strokeWidth={2}
                                style={{
                                    flexShrink: 0,
                                    marginTop: 1,
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        mb: 0.5,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: "inherit",
                                    }}
                                >
                                    Đặt lại mật khẩu thành công
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        lineHeight: 1.7,
                                        color: "inherit",
                                    }}
                                >
                                    Mật khẩu của bạn đã được cập nhật. Hãy quay
                                    lại trang đăng nhập để tiếp tục.
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() =>
                                router.replace("/login?password-reset=success")
                            }
                            sx={loginButtonSx}
                        >
                            Quay lại đăng nhập
                        </Button>
                    </Box>
                ) : recoveryState === "invalid" ? (
                    <Box>
                        <Typography
                            role="alert"
                            sx={{
                                mb: 2.5,
                                fontSize: 13,
                                lineHeight: 1.7,
                                color: COLORS.error,
                            }}
                        >
                            Liên kết khôi phục không hợp lệ, đã hết hạn hoặc đã
                            được sử dụng. Vui lòng yêu cầu email khôi phục mới.
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => router.replace("/forgot-password")}
                            sx={loginButtonSx}
                        >
                            Yêu cầu liên kết mới
                        </Button>
                    </Box>
                ) : (
                    <Formik<ResetPasswordValues>
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            status,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            setStatus,
                        }) => (
                            <Form noValidate>
                                <Box sx={{ mb: 2.5 }}>
                                    <QRTextField
                                        id="password"
                                        name="password"
                                        label="Mật khẩu mới"
                                        placeholder="Nhập mật khẩu mới"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        fullWidth
                                        value={values.password}
                                        onChange={(event) => {
                                            handleChange(event);
                                            setStatus(undefined);
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        errorMessage={
                                            touched.password
                                                ? errors.password
                                                : undefined
                                        }
                                        slotProps={{
                                            input: {
                                                endAdornment: passwordAdornment(
                                                    showPassword,
                                                    () =>
                                                        setShowPassword(
                                                            (previous) =>
                                                                !previous,
                                                        ),
                                                    isSubmitting,
                                                ),
                                            },
                                        }}
                                        sx={loginTextFieldSx}
                                    />
                                </Box>

                                <Box sx={{ mb: 2.5 }}>
                                    <QRTextField
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu"
                                        placeholder="Nhập lại mật khẩu mới"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        fullWidth
                                        value={values.confirmPassword}
                                        onChange={(event) => {
                                            handleChange(event);
                                            setStatus(undefined);
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
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
                                                    isSubmitting,
                                                ),
                                            },
                                        }}
                                        sx={loginTextFieldSx}
                                    />
                                </Box>

                                <Box
                                    aria-live="polite"
                                    sx={{
                                        minHeight: 48,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {typeof status === "string" && (
                                        <Typography
                                            role="alert"
                                            sx={{
                                                fontSize: 12,
                                                lineHeight: 1.6,
                                                color: COLORS.error,
                                            }}
                                        >
                                            {status}
                                        </Typography>
                                    )}
                                </Box>

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={
                                        isSubmitting ||
                                        recoveryState !== "valid"
                                    }
                                    sx={loginButtonSx}
                                >
                                    {isSubmitting
                                        ? "Đang đặt lại..."
                                        : "Đặt lại mật khẩu"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}

                {!resetSuccess && (
                    <Button
                        fullWidth
                        type="button"
                        variant="text"
                        onClick={() => router.push("/login")}
                        sx={{
                            mt: 1.5,
                            textTransform: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            color: COLORS.primary,
                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        Quay lại đăng nhập
                    </Button>
                )}

                <Typography
                    sx={{
                        mt: 3,
                        fontSize: 11,
                        lineHeight: 1.6,
                        textAlign: "center",
                        color: COLORS.textMuted,
                    }}
                >
                    © {new Date().getFullYear()} QR Feedback
                </Typography>
            </Box>
        </Box>
    );
}
