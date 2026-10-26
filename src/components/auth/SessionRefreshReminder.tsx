"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import { X } from "lucide-react";

import { createClient } from "@/lib/supabase/browser";
import {
    clearSessionCycle,
    getSessionStartedAt,
    SESSION_DURATION_MS,
    SESSION_REMINDER_BEFORE_MS,
    startSessionCycle,
} from "@/lib/auth/session-refresh";
import { buttonBaseSx } from "@/styles/button.styles";

export default function SessionRefreshReminder() {
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
    const handlingExpiryRef = useRef(false);
    const refreshingRef = useRef(false);

    const getSupabase = useCallback(() => {
        if (!supabaseRef.current) {
            supabaseRef.current = createClient();
        }

        return supabaseRef.current;
    }, []);

    const logout = useCallback(async () => {
        if (handlingExpiryRef.current) return;

        handlingExpiryRef.current = true;
        clearSessionCycle();

        try {
            await getSupabase().auth.signOut({ scope: "local" });
        } finally {
            router.replace("/login?reason=session-expired");
            router.refresh();
        }
    }, [getSupabase, router]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let disposed = false;

        const checkSessionTime = () => {
            if (disposed || handlingExpiryRef.current) return;

            let startedAt = getSessionStartedAt();

            if (startedAt === null) {
                startedAt = Date.now();
                startSessionCycle(startedAt);
            }

            const elapsed = Date.now() - startedAt;
            const remaining = SESSION_DURATION_MS - elapsed;

            if (remaining <= 0) {
                void logout();
                return;
            }

            setVisible(remaining <= SESSION_REMINDER_BEFORE_MS);

            timeoutId = setTimeout(
                checkSessionTime,
                Math.min(
                    remaining > SESSION_REMINDER_BEFORE_MS
                        ? remaining - SESSION_REMINDER_BEFORE_MS
                        : remaining,
                    30_000,
                ),
            );
        };

        checkSessionTime();

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                if (timeoutId) clearTimeout(timeoutId);
                checkSessionTime();
            }
        };

        window.addEventListener("focus", handleVisibilityChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            disposed = true;

            if (timeoutId) clearTimeout(timeoutId);

            window.removeEventListener("focus", handleVisibilityChange);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [logout]);

    const handleRefresh = async () => {
        if (refreshingRef.current || handlingExpiryRef.current) return;

        refreshingRef.current = true;
        setLoading(true);

        try {
            const supabase = getSupabase();

            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                await logout();
                return;
            }

            const { data, error: refreshError } =
                await supabase.auth.refreshSession();

            if (refreshError || !data.session) {
                await logout();
                return;
            }

            startSessionCycle(Date.now());
            setVisible(false);
        } catch {
            await logout();
        } finally {
            refreshingRef.current = false;
            setLoading(false);
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                left: "50%",
                bottom: 24,
                transform: "translateX(-50%)",
                width: "calc(100% - 32px)",
                maxWidth: 960,
                zIndex: 1500,
            }}
        >
            <Paper
                elevation={8}
                role="alertdialog"
                aria-labelledby="session-reminder-title"
                aria-describedby="session-reminder-description"
                sx={{
                    position: "relative",
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: { xs: 1.5, sm: 3 },
                    py: 1,
                    border: "1px solid var(--color-border)",
                    borderTop: "3px solid #f59e0b",
                    borderRadius: 2,
                    bgcolor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    boxShadow: "0 8px 28px rgba(16, 24, 40, 0.16)",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        textAlign: "center",
                        pl: { xs: 0, sm: 2 },
                    }}
                >
                    <Typography
                        id="session-reminder-title"
                        sx={{
                            fontSize: 15,
                            fontWeight: 700,
                            lineHeight: 1.4,
                            mb: 0.5,
                        }}
                    >
                        Phiên đăng nhập sắp hết hạn
                    </Typography>

                    <Typography
                        id="session-reminder-description"
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.4,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        Làm mới phiên để tiếp tục sử dụng. Bạn sẽ tự động đăng
                        xuất sau 5 phút.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    disabled={loading}
                    onClick={() => void handleRefresh()}
                    sx={{
                        ...buttonBaseSx,
                        flexShrink: 0,
                        minHeight: 30,
                        px: { xs: 1.5, sm: 2.5 },
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&.Mui-disabled": {
                            opacity: 0.7,
                            color: "var(--color-button-primary-text)",
                            bgcolor: "var(--color-button-primary-bg)",
                        },
                    }}
                >
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            <CircularProgress
                                size={16}
                                sx={{
                                    color: "var(--color-button-primary-text)",
                                }}
                            />
                            <Box component="span">Đang làm mới...</Box>
                        </Box>
                    ) : (
                        "Làm mới phiên"
                    )}
                </Button>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "stretch",
                        borderLeft: "1px solid var(--color-border)",
                        pl: { xs: 0.5, sm: 1.5 },
                        ml: { xs: 0, sm: 0.5 },
                    }}
                >
                    <IconButton
                        aria-label="Đóng thông báo"
                        onClick={handleClose}
                        size="small"
                        sx={{
                            color: "var(--color-text-secondary)",
                            borderRadius: 1,
                            "&:hover": {
                                bgcolor: "var(--color-surface-hover)",
                                color: "var(--color-text-primary)",
                            },
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}
