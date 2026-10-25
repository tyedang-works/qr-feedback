"use client";

import { Box, Button, Typography } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import Logo from "@/components/common/Logo";
import QRTextField from "@/components/common/input/QRTextField";
import { createClient } from "@/lib/supabase/browser";
import { loginButtonSx, loginTextFieldSx } from "@/styles/login.styles";
import { Info } from "lucide-react";

type ForgotPasswordValues = {
    email: string;
};

const initialValues: ForgotPasswordValues = {
    email: "",
};

const validationSchema = Yup.object({
    email: Yup.string().trim().required(" ").email("Email không hợp lệ."),
});

const RESEND_COOLDOWN_SECONDS = 60;

const COLORS = {
    background: "#ffffff",
    surface: "#ffffff",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    border: "#e5e7eb",
    primary: "#193b56",
    error: "#d92d20",
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [cooldown, setCooldown] = useState(0);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        if (cooldown === 0) return;

        const timer = window.setInterval(() => {
            setCooldown((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [cooldown]);

    const handleSubmit = async (
        values: ForgotPasswordValues,
        { setSubmitting, setStatus }: FormikHelpers<ForgotPasswordValues>,
    ) => {
        setStatus(undefined);

        try {
            const supabase = createClient();
            const redirectTo = new URL(
                "/reset-password",
                window.location.origin,
            ).toString();

            const { error } = await supabase.auth.resetPasswordForEmail(
                values.email.trim(),
                { redirectTo },
            );

            if (error) {
                if (
                    error.code === "over_email_send_rate_limit" ||
                    error.message?.includes("email rate limit exceeded")
                ) {
                    setStatus(
                        "Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng chờ trước khi thử lại.",
                    );
                    return;
                }

                setStatus(
                    "Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại sau.",
                );
                return;
            }

            setRequestSent(true);
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setStatus({
                type: "success",
                message:
                    "Nếu email này được đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến và thư rác.",
            });
        } catch {
            setStatus("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
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
                        Quên mật khẩu?
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.7,
                            color: COLORS.textSecondary,
                        }}
                    >
                        Nhập email của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại
                        mật khẩu nếu email này đã được đăng ký.
                    </Typography>
                </Box>

                <Formik<ForgotPasswordValues>
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
                                    id="email"
                                    name="email"
                                    type="email"
                                    label="Email"
                                    required
                                    fullWidth
                                    value={values.email}
                                    onChange={(event) => {
                                        handleChange(event);
                                        setStatus(undefined);
                                        setRequestSent(false);
                                    }}
                                    onBlur={handleBlur}
                                    placeholder="Nhập email"
                                    autoComplete="email"
                                    errorMessage={
                                        touched.email ? errors.email : undefined
                                    }
                                    sx={loginTextFieldSx}
                                />
                            </Box>

                            <Box
                                aria-live="polite"
                                sx={{
                                    minHeight: 48,
                                    mb: 1,
                                }}
                            >
                                {status &&
                                    (typeof status === "string" ||
                                        cooldown > 0) && (
                                        <Box
                                            role="status"
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 1.25,
                                                p: 1.5,
                                                border: "1px solid #e9d8be",
                                                borderRadius: 2,
                                                backgroundColor: "#f8f0e4",
                                                color: "#9a5b13",
                                            }}
                                        >
                                            <Info
                                                size={17}
                                                strokeWidth={1.8}
                                                style={{
                                                    flexShrink: 0,
                                                    marginTop: 1,
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    lineHeight: 1.6,
                                                    fontWeight: 500,
                                                    color: "inherit",
                                                }}
                                            >
                                                {typeof status === "string"
                                                    ? status
                                                    : status.message}
                                            </Typography>
                                        </Box>
                                    )}
                            </Box>

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting || cooldown > 0}
                                sx={loginButtonSx}
                            >
                                {isSubmitting
                                    ? "Đang gửi..."
                                    : requestSent && cooldown > 0
                                      ? `Gửi lại sau ${cooldown}s`
                                      : requestSent
                                        ? "Gửi lại email"
                                        : "Gửi hướng dẫn"}
                            </Button>

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
                        </Form>
                    )}
                </Formik>

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
