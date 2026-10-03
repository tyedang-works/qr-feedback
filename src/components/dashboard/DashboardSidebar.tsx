"use client";

import Logo from "@/components/common/Logo";
import DashboardNavigationProgress from "@/components/dashboard/DashboardNavigationProgress";
import { createClient } from "@/lib/supabase/browser";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavigationItem = {
    label: string;
    href?: string;
};

const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Feedback",
        href: "/dashboard/feedback",
    },
    {
        label: "Tables",
        href: "/dashboard/tables",
    },
    {
        label: "QR Codes",
        href: "/dashboard/qr-codes",
    },
    {
        label: "Cài đặt",
        href: "/dashboard/settings",
    },
];

export default function DashboardSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(false);
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();

        router.push("/login");
        router.refresh();
    };

    const isActive = (href?: string) => {
        if (!href) {
            return false;
        }

        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return pathname.startsWith(href);
    };

    const handleNavigation = (href: string) => {
        if (href === pathname) {
            return;
        }

        setIsNavigating(true);
    };

    return (
        <>
            <DashboardNavigationProgress isLoading={isNavigating} />

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
                {/* Logo */}
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

                {/* Navigation */}
                <Stack
                    component="nav"
                    aria-label="Dashboard navigation"
                    sx={{
                        gap: 0.5,
                    }}
                >
                    {navigationItems.map((item) => {
                        const active = isActive(item.href);

                        const buttonSx = {
                            justifyContent: "flex-start",
                            px: 1.5,
                            py: 1.25,
                            borderRadius: 1.5,
                            color: active ? "#193B56" : "#667085",
                            backgroundColor: active ? "#eef4f8" : "transparent",
                            fontWeight: active ? 700 : 500,
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: active ? "#eef4f8" : "#f8fafc",
                            },
                        };
                        if (item.href) {
                            const isCurrentPage =
                                item.href === "/dashboard" &&
                                pathname === "/dashboard";

                            if (isCurrentPage) {
                                return (
                                    <Button
                                        key={item.label}
                                        fullWidth
                                        sx={buttonSx}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    href={item.href}
                                    fullWidth
                                    onClick={() => handleNavigation(item.href!)}
                                    sx={buttonSx}
                                >
                                    {item.label}
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={item.label}
                                fullWidth
                                disabled
                                sx={{
                                    ...buttonSx,
                                    color: "#98a2b3",
                                }}
                            >
                                {item.label}
                            </Button>
                        );
                    })}
                </Stack>

                {/* Push Admin section to bottom */}
                <Box sx={{ flex: 1 }} />

                <Divider sx={{ mb: 2 }} />

                {/* Admin */}
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
                            "&:hover": {
                                backgroundColor: "#f8fafc",
                                color: "#344054",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>
        </>
    );
}
