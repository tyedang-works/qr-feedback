"use client";

import type { UserContext } from "@/lib/auth/queries";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
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

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                backgroundColor: "#f8fafc",
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
                <DashboardSidebar role={userContext?.role ?? null} />
            </Box>

            <Box
                className="dashboard-mobile-header"
                sx={{ display: { xs: "block", md: "none" } }}
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
                            height: 64,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            px: 1.5,
                            backgroundColor: "#ffffff",
                            borderBottom: "1px solid #e5e7eb",
                        }}
                    >
                        <IconButton
                            onClick={handleOpenSidebar}
                            aria-label="Open menu"
                            size="small"
                        >
                            <Box
                                sx={{
                                    width: 22,
                                    height: 18,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                {[1, 2, 3].map((item) => (
                                    <Box
                                        key={item}
                                        component="span"
                                        sx={{
                                            width: "100%",
                                            height: 2,
                                            borderRadius: 1,
                                            backgroundColor: "#193B56",
                                        }}
                                    />
                                ))}
                            </Box>
                        </IconButton>

                        <Typography
                            sx={{
                                fontSize: 17,
                                fontWeight: 700,
                                color: "#193B56",
                            }}
                        >
                            QR Feedback
                        </Typography>
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
                                width: 240,
                                height: "100dvh",
                                backgroundColor: "#ffffff",
                            },
                        },
                    }}
                >
                    <DashboardSidebar role={userContext?.role ?? null} />
                </Drawer>
            </Box>

            <Box
                component="main"
                className="dashboard-main"
                sx={{
                    flex: 1,
                    width: "100%",
                    minWidth: 0,
                    px: { xs: 2, sm: 3 },
                    pt: { xs: "80px", md: 3 },
                    pb: 3,
                }}
            >
                <DashboardHeader
                    fullName={userContext?.fullName ?? null}
                    restaurantName={userContext?.restaurantName ?? null}
                    role={userContext?.role ?? null}
                />

                {children}
            </Box>
        </Box>
    );
}
