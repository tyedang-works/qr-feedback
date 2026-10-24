"use client";

import { Box, Button, Typography } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import Logo from "@/components/common/Logo";
import QRTextField from "@/components/common/input/QRTextField";
import { createClient } from "@/lib/supabase/browser";
import { loginButtonSx, loginTextFieldSx } from "@/styles/login.styles";

type LoginFormValues = {
    email: string;
    password: string;
};

const initialValues: LoginFormValues = {
    email: "",
    password: "",
};

const validationSchema = Yup.object({
    email: Yup.string().trim().required(" ").email("Email không hợp lệ."),
    password: Yup.string().required(" "),
});

const LOGIN_COLORS = {
    background: "#ffffff",
    surface: "#ffffff",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    border: "#e5e7eb",
    primary: "#193b56",
    primaryHover: "#244e6c",
    primaryActive: "#16344b",
    error: "#d92d20",
    heroBackground: "#e9e3d9",
} as const;

export default function LoginForm() {
    const router = useRouter();

    const handleSubmit = async (
        values: LoginFormValues,
        { setSubmitting, setStatus }: FormikHelpers<LoginFormValues>,
    ) => {
        setStatus(undefined);

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithPassword({
                email: values.email.trim(),
                password: values.password,
            });

            if (error) {
                setStatus("Email hoặc mật khẩu không chính xác.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setStatus("Không thể đăng nhập. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(420px, 0.9fr) minmax(0, 1.1fr)",
                },
                minHeight: "100dvh",
                backgroundColor: LOGIN_COLORS.background,
                color: LOGIN_COLORS.textPrimary,
                colorScheme: "light",
                "&, & *": {
                    boxSizing: "border-box",
                },
            }}
        >
            {/* left */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                    px: { xs: 2.5, sm: 4, md: 5, lg: 7 },
                    py: { xs: 4, md: 6 },
                    backgroundColor: LOGIN_COLORS.background,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 440,
                        p: { xs: 3, sm: 4, md: 4.5 },
                        border: `1px solid ${LOGIN_COLORS.border}`,
                        borderRadius: 3,
                        backgroundColor: LOGIN_COLORS.surface,
                        boxShadow:
                            "0 2px 4px rgba(16, 24, 40, 0.02), 0 12px 32px rgba(16, 24, 40, 0.07), 0 32px 64px -24px rgba(16, 24, 40, 0.10)",
                        transition: "box-shadow 200ms ease",
                        "@media (prefers-reduced-motion: reduce)": {
                            transition: "none",
                        },
                    }}
                >
                    {/* logo */}
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
                                color: LOGIN_COLORS.textPrimary,
                            }}
                        >
                            QR Feedback
                        </Typography>
                    </Box>

                    {/* title */}
                    <Box sx={{ mb: 3.5 }}>
                        <Typography
                            component="h1"
                            sx={{
                                mb: 1,
                                fontSize: { xs: 22, sm: 26 },
                                lineHeight: 1.3,
                                fontWeight: 700,
                                letterSpacing: "-0.6px",
                                color: LOGIN_COLORS.textPrimary,
                            }}
                        >
                            Chào mừng bạn trở lại
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                lineHeight: 1.7,
                                color: LOGIN_COLORS.textSecondary,
                            }}
                        >
                            Đăng nhập để quản lý phản hồi của nhà hàng.
                        </Typography>
                    </Box>

                    <Formik<LoginFormValues>
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

                                            if (status) {
                                                setStatus(undefined);
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        placeholder="Nhập email"
                                        autoComplete="email"
                                        errorMessage={
                                            touched.email
                                                ? errors.email
                                                : undefined
                                        }
                                        sx={loginTextFieldSx}
                                    />
                                </Box>

                                <QRTextField
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="Mật khẩu"
                                    required
                                    fullWidth
                                    value={values.password}
                                    onChange={(event) => {
                                        handleChange(event);

                                        if (status) {
                                            setStatus(undefined);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    placeholder="Nhập mật khẩu"
                                    autoComplete="current-password"
                                    errorMessage={
                                        touched.password
                                            ? errors.password
                                            : undefined
                                    }
                                    sx={loginTextFieldSx}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        mt: 1.5,
                                    }}
                                >
                                    <Button
                                        type="button"
                                        variant="text"
                                        size="small"
                                        sx={{
                                            p: 0,
                                            minWidth: 0,
                                            textTransform: "none",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: LOGIN_COLORS.primary,
                                            textDecoration: "underline",
                                            textUnderlineOffset: "3px",
                                            backgroundColor: "transparent",
                                            "&:hover": {
                                                color: LOGIN_COLORS.primaryHover,
                                                backgroundColor: "transparent",
                                                textDecoration: "underline",
                                            },
                                            "&:active": {
                                                color: LOGIN_COLORS.primaryActive,
                                            },
                                        }}
                                    >
                                        Quên mật khẩu?
                                    </Button>
                                </Box>

                                <Box
                                    sx={{
                                        minHeight: 40,
                                        mt: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {typeof status === "string" && (
                                        <Typography
                                            role="alert"
                                            sx={{
                                                fontSize: 12,
                                                lineHeight: 1.5,
                                                color: LOGIN_COLORS.error,
                                                textAlign: "center",
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
                                    disabled={isSubmitting}
                                    sx={loginButtonSx}
                                >
                                    {isSubmitting
                                        ? "Đang đăng nhập..."
                                        : "Đăng nhập"}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <Typography
                        sx={{
                            mt: 3.5,
                            fontSize: 11,
                            lineHeight: 1.6,
                            textAlign: "center",
                            color: LOGIN_COLORS.textMuted,
                        }}
                    >
                        © {new Date().getFullYear()} QR Feedback
                    </Typography>
                </Box>
            </Box>

            {/* right */}
            <Box
                sx={{
                    position: "relative",
                    display: { xs: "none", md: "block" },
                    minWidth: 0,
                    minHeight: "100dvh",
                    overflow: "hidden",
                    backgroundColor: LOGIN_COLORS.heroBackground,
                }}
            >
                <Box
                    component="img"
                    src="/assets/qr-feedback-login-hero.svg"
                    alt="QR Feedback — restaurant customer experience"
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />
            </Box>
        </Box>
    );
}
