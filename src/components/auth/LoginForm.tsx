"use client";

import Logo from "@/components/common/Logo";
import { createClient } from "@/lib/supabase/browser";
import {
    Box,
    Button,
    Divider,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const inputSx = {
    "& .MuiInputBase-root": {
        minHeight: 44,
        borderRadius: 3,
        backgroundColor: "#f5f6f7",
    },

    "& .MuiInputBase-input": {
        fontSize: 14,
        px: 1.75,

        "&:-webkit-autofill": {
            WebkitBoxShadow:
                "0 0 0 100px #f5f6f7 inset",
            WebkitTextFillColor: "#263238",
            caretColor: "#263238",
        },

        "&:-webkit-autofill:hover": {
            WebkitBoxShadow:
                "0 0 0 100px #f5f6f7 inset",
        },

        "&:-webkit-autofill:focus": {
            WebkitBoxShadow:
                "0 0 0 100px #f5f6f7 inset",
        },
    },
};

export default function LoginForm() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError("");

        if (!email.trim()) {
            setError("Vui lòng nhập email.");
            return;
        }

        if (!password) {
            setError("Vui lòng nhập mật khẩu.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

            if (loginError) {
                setError(
                    "Email hoặc mật khẩu không chính xác.",
                );
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(
                "Login failed:",
                error,
            );

            setError(
                "Không thể đăng nhập. Vui lòng thử lại.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 3,
                backgroundColor: "#f5f6f7",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 420,
                    minHeight: 620,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    boxShadow:
                        "0 8px 30px rgba(0, 0, 0, 0.08)",
                }}
            >
                {/* Content */}
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        px: {
                            xs: 4,
                            sm: 5,
                        },
                        pt: 5,
                        pb: 4,
                    }}
                >
                    {/* Header */}
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Logo size={68} />
                            </Box>
                        </Grid>
                        <Grid size={12} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box component="div" sx={{ display: "block" }}>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        opacity: 0.9,
                                        color: "#263238",
                                    }}
                                >
                                    Welcome Back!
                                </Typography>

                                <Typography
                                    component="h2"
                                    sx={{
                                        fontSize: {
                                            xs: 28,
                                            sm: 32,
                                        },
                                        lineHeight: 1.1,
                                        fontWeight: 700,
                                        color: "#263238",
                                        display: "block",
                                    }}
                                >
                                    Sign In
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ marginTop: "26px" }}
                    >
                        <Typography
                            component="label"
                            htmlFor="email"
                            sx={{
                                display: "block",
                                mb: 0.75,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#263238",
                            }}
                        >
                            Email Address
                        </Typography>

                        <TextField
                            id="email"
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);

                                if (error) {
                                    setError("");
                                }
                            }}
                            placeholder="Nhập email"
                            autoComplete="email"
                            size="small"
                            sx={{ ...inputSx, mb: 3 }}
                        />

                        <Typography
                            component="label"
                            htmlFor="password"
                            sx={{
                                display: "block",
                                mb: 0.75,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#263238",
                            }}
                        >
                            Password
                        </Typography>

                        <TextField
                            id="password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);

                                if (error) {
                                    setError("");
                                }
                            }}
                            placeholder="Nhập mật khẩu"
                            autoComplete="current-password"
                            size="small"
                            sx={inputSx}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
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
                                    color: "#183750",
                                }}
                            >
                                Forgot password?
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                height: 30,
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: "error.main",
                                    textAlign: "center",
                                    visibility: error ? "visible" : "hidden",
                                }}
                            >
                                {error || " "}
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                minHeight: 44,
                                borderRadius: 3,
                                backgroundColor: "#183750",
                                textTransform: "none",
                                fontSize: 14,
                                fontWeight: 700,
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#122b3f",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            {isSubmitting
                                ? "Signing in..."
                                : "Sign in"}
                        </Button>

                        {/* Divider */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                my: 4,
                            }}
                        >
                            <Divider sx={{ flex: 1 }} />

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "text.secondary",
                                }}
                            >
                                Or
                            </Typography>

                            <Divider sx={{ flex: 1 }} />
                        </Box>

                        {/* Social login placeholder */}
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{
                                minHeight: 44,
                                borderRadius: 3,
                                textTransform: "none",
                                fontSize: 14,
                                fontWeight: 600,
                            }}
                        >
                            Continue with Google
                        </Button>

                        {/* Sign up */}
                        <Typography
                            sx={{
                                mt: 4,
                                textAlign: "center",
                                fontSize: 12,
                                color: "text.secondary",
                            }}
                        >
                            Don't have an account?{" "}
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 700,
                                    color: "#183750",
                                }}
                            >
                                Sign up
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}