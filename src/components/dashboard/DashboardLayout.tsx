"use client";

import type { UserContext } from "@/lib/auth/queries";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

type DashboardLayoutProps = {
    children: React.ReactNode;
    userContext: UserContext | null;
};

export default function DashboardLayout({
    children,
    userContext,
}: DashboardLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const handleOpenSidebar = () => setIsMobileSidebarOpen(true);
    const handleCloseSidebar = () => setIsMobileSidebarOpen(false);

    const role = userContext?.role ?? null;
    const fullName = userContext?.fullName ?? null;
    const restaurantName = userContext?.restaurantName ?? null;

    const sidebarProps = {
        role,
        fullName,
        restaurantName,
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                bgcolor: "var(--color-background, #FFFFFF)",
                color: "var(--color-text-primary, #111827)",
            }}
        >
            <Box
                className="dashboard-sidebar"
                sx={{
                    display: { xs: "none", md: "block" },
                    position: "sticky",
                    top: 0,
                    alignSelf: "flex-start",
                    flexShrink: 0,
                    height: "100dvh",
                }}
            >
                <DashboardSidebar {...sidebarProps} />
            </Box>

            <Box
                className="dashboard-mobile-header"
                sx={{
                    display: { xs: "block", md: "none" },
                }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1100,
                    }}
                >
                    <Stack
                        sx={{
                            minHeight: 64,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1.5,
                            px: 2,
                            py: 1,
                            bgcolor: "var(--color-surface, #FFFFFF)",
                            borderBottom:
                                "1px solid var(--color-border, #F0F1F3)",
                        }}
                    >
                        <IconButton
                            onClick={handleOpenSidebar}
                            aria-label="Mở menu"
                            aria-expanded={isMobileSidebarOpen}
                            size="small"
                            sx={{
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                color: "var(--color-text-primary, #111827)",
                                borderRadius: 2,
                                "&:hover": {
                                    bgcolor:
                                        "var(--color-surface-hover, #F9FAFB)",
                                },
                            }}
                        >
                            <MenuIcon size={21} strokeWidth={1.8} />
                        </IconButton>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    lineHeight: 1.4,
                                    fontWeight: 600,
                                    letterSpacing: "0.7px",
                                    color: "var(--color-text-muted, #9CA3AF)",
                                    textTransform: "uppercase",
                                }}
                            >
                                QR Feedback
                            </Typography>

                            <Typography
                                noWrap
                                title={restaurantName || "Restaurant"}
                                sx={{
                                    fontSize: 14,
                                    lineHeight: 1.4,
                                    fontWeight: 700,
                                    color: "var(--color-text-primary, #111827)",
                                }}
                            >
                                {restaurantName || "Restaurant"}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Drawer
                    anchor="left"
                    open={isMobileSidebarOpen}
                    onClose={handleCloseSidebar}
                    transitionDuration={{ enter: 220, exit: 180 }}
                    slotProps={{
                        paper: {
                            sx: {
                                width: "240px",
                                maxWidth: "85vw",
                                height: "100dvh",
                                bgcolor: "var(--color-surface, #FFFFFF)",
                                borderRight:
                                    "1px solid var(--color-border, #F0F1F3)",
                                boxShadow: "0 8px 32px rgba(17, 24, 39, 0.08)",
                            },
                        },
                    }}
                >
                    <DashboardSidebar
                        {...sidebarProps}
                        onNavigate={handleCloseSidebar}
                    />
                </Drawer>
            </Box>

            <Box
                component="main"
                className="dashboard-main"
                sx={{
                    flex: 1,
                    width: 0,
                    minWidth: 0,
                    minHeight: "100dvh",
                    bgcolor: "var(--color-background, #FFFFFF)",
                    px: {
                        xs: 2,
                        sm: 3,
                        lg: 3.5,
                        xl: 4,
                    },
                    pt: {
                        xs: "80px",
                        md: 3,
                    },
                    pb: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
