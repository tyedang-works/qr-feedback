"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Typography,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import Logo from "@/components/common/Logo";
import QRTextField from "@/components/common/input/QRTextField";
import { startSessionCycle } from "@/lib/auth/session-refresh";
import { createClient } from "@/lib/supabase/browser";
import { loginButtonSx, loginTextFieldSx } from "@/styles/login.styles";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import LanguageToggle from "../common/language/LanguageToggle";
import { useTranslation } from "../common/providers/useTranslation";
import LoginBrandPanel from "./LoginBrandPanel";

type LoginFormValues = {
    email: string;
    password: string;
};

const initialValues: LoginFormValues = {
    email: "",
    password: "",
};

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
    const { t } = useTranslation();
    const router = useRouter();

    const validationSchema = Yup.object({
        email: Yup.string()
            .trim()
            .required(" ")
            .email(t("login", "emailInvalid")),
        password: Yup.string().required(" "),
    });

    const [resetEmail] = useState(() => {
        if (typeof window === "undefined") return "";

        const email = sessionStorage.getItem("reset-password-email") ?? "";
        if (email) {
            sessionStorage.removeItem("reset-password-email");
        }

        return email;
    });

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
                setStatus(t("login", "invalidEmailOrPassword"));
                return;
            }
            startSessionCycle();
            router.push("/dashboard");
            router.refresh();
        } catch {
            setStatus(t("login", "loginError"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        router.push("/forgot-password");
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "minmax(0, 2fr) minmax(420px, 1fr)",
                },
                minHeight: "100dvh",
                p: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.5,
                },
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
                    display: { xs: "none", md: "flex" },
                    minWidth: 0,
                    height: "calc(100dvh - 40px)",
                    p: 1,
                    backgroundColor: LOGIN_COLORS.surface,
                    overflow: "hidden",
                }}
            >
                <LoginBrandPanel />
            </Box>

            {/* right */}
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                    minHeight: {
                        xs: "100dvh",
                        md: "calc(100dvh - 40px)",
                    },
                    px: { xs: 3, sm: 4, md: 5, lg: 7 },
                    py: { xs: 8, md: 6 },
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    colorScheme: "light",
                }}
            >
                {/* language toggle */}
                <Box
                    sx={{
                        position: "absolute",
                        top: { xs: 20, sm: 28 },
                        right: { xs: 20, sm: 32 },
                        zIndex: 2,
                    }}
                >
                    <LanguageToggle forceLight />
                </Box>

                {/* login content */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: 400,
                    }}
                >
                    {/* logo */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 4,
                        }}
                    >
                        <Logo height="46px" width="46px" />

                        <Typography
                            component="span"
                            sx={{
                                fontSize: 20,
                                fontWeight: 700,
                                letterSpacing: "-0.4px",
                                color: "#111827",
                            }}
                        >
                            QR Feedback
                        </Typography>
                    </Box>

                    {/* heading */}
                    <Box
                        sx={{
                            width: "100%",
                            mb: 3.5,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            component="h1"
                            sx={{
                                mb: 1,
                                fontSize: { xs: 24, sm: 28 },
                                lineHeight: 1.3,
                                fontWeight: 700,
                                letterSpacing: "-0.6px",
                                color: "#111827",
                            }}
                        >
                            {t("login", "welcomeBack")}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: "#667085",
                            }}
                        >
                            {t("login", "description")}
                        </Typography>
                    </Box>

                    {/* form */}
                    <Box sx={{ width: "100%" }}>
                        <Formik<LoginFormValues>
                            initialValues={{
                                ...initialValues,
                                email: resetEmail,
                            }}
                            enableReinitialize
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
                                    {/* email field */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <QRTextField
                                            id="email"
                                            name="email"
                                            type="email"
                                            label={t("login", "email")}
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
                                            placeholder={t(
                                                "login",
                                                "emailPlaceholder",
                                            )}
                                            autoComplete="email"
                                            errorMessage={
                                                touched.email
                                                    ? errors.email
                                                    : undefined
                                            }
                                            sx={{
                                                ...loginTextFieldSx,
                                                "& .MuiInputBase-root": {
                                                    minHeight: 48,
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* password field */}
                                    <QRTextField
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        label={t("login", "password")}
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
                                        placeholder={t(
                                            "login",
                                            "passwordPlaceholder",
                                        )}
                                        autoComplete="current-password"
                                        errorMessage={
                                            touched.password
                                                ? errors.password
                                                : undefined
                                        }
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            type="button"
                                                            edge="end"
                                                            size="small"
                                                            aria-label={
                                                                showPassword
                                                                    ? t(
                                                                          "login",
                                                                          "hidePassword",
                                                                      )
                                                                    : t(
                                                                          "login",
                                                                          "showPassword",
                                                                      )
                                                            }
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    (
                                                                        previous,
                                                                    ) =>
                                                                        !previous,
                                                                )
                                                            }
                                                            sx={{
                                                                color: "var(--color-text-secondary)",
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "rgba(25, 59, 86, 0.06)",
                                                                },
                                                            }}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff
                                                                    size={18}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={18}
                                                                />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            ...loginTextFieldSx,
                                            "& .MuiInputBase-root": {
                                                minHeight: 48,
                                            },
                                        }}
                                    />

                                    {/* forgot password */}
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
                                            onClick={handleForgotPassword}
                                            sx={{
                                                p: 0,
                                                minWidth: 0,
                                                textTransform: "none",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: LOGIN_COLORS.primary,
                                                textDecoration: "none",
                                                "&:hover": {
                                                    color: LOGIN_COLORS.primaryHover,
                                                    backgroundColor:
                                                        "transparent",
                                                    textDecoration: "underline",
                                                },
                                                "&:active": {
                                                    color: LOGIN_COLORS.primaryActive,
                                                },
                                            }}
                                        >
                                            {t("login", "forgotPassword")}
                                        </Button>
                                    </Box>

                                    {/* error message */}
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
                                        sx={{
                                            ...loginButtonSx,
                                            minHeight: 52,
                                        }}
                                    >
                                        {isSubmitting
                                            ? t("login", "loggingIn")
                                            : t("login", "login")}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Box>

                    <Typography
                        sx={{
                            mt: 3.5,
                            fontSize: 11,
                            lineHeight: 1.6,
                            textAlign: "center",
                            color: "#98a2b3",
                        }}
                    >
                        © {new Date().getFullYear()} QR Feedback
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
