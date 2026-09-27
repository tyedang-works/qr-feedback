"use client";

import Logo from "@/components/common/Logo";
import { createClient } from "@/lib/supabase/browser";
import {
    Box,
    Button,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardSidebar() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();

        router.push("/login");
        router.refresh();
    };

    return (
        <Box
            sx={{
                width: 240,
                height: "100dvh",
                overflowY: "auto",
                boxSizing: "border-box",
                borderRight: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                px: 2,
                py: 2.5,
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1,
                }}
            >
                <Logo size={40} />

                <Typography
                    sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    QR Feedback
                </Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack
                sx={{
                    gap: 0.5,
                }}
            >
                <Button
                    fullWidth
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        color: "#193B56",
                        backgroundColor: "#eef4f8",
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Dashboard
                </Button>

                <Button
                    fullWidth
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        color: "#667085",
                        fontWeight: 500,
                        textTransform: "none",
                    }}
                >
                    Feedback
                </Button>

                <Button
                    fullWidth
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        color: "#667085",
                        fontWeight: 500,
                        textTransform: "none",
                    }}
                >
                    Tables
                </Button>

                <Button
                    fullWidth
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        color: "#667085",
                        fontWeight: 500,
                        textTransform: "none",
                    }}
                >
                    QR Codes
                </Button>

                <Button
                    component={Link}
                    href="/dashboard/feedback"
                    fullWidth
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        color: "#667085",
                        fontWeight: 500,
                        textTransform: "none",
                    }}
                >
                    Feedback
                </Button>
            </Stack>

            <Box sx={{ flex: 1 }} />

            <Divider sx={{ mb: 2 }} />

            <Stack sx={{ gap: 1 }}>
                <Typography
                    sx={{
                        px: 1.5,
                        fontSize: 13,
                        color: "#667085",
                    }}
                >
                    Admin
                </Typography>

                <Button
                    fullWidth
                    onClick={handleLogout}
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1.5,
                        color: "#667085",
                        fontWeight: 500,
                        textTransform: "none",
                    }}
                >
                    Logout
                </Button>
            </Stack>
        </Box>
    );
}