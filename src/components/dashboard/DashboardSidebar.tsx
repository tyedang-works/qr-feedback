"use client";

import Logo from "@/components/common/Logo";
import DashboardNavigationProgress from "@/components/dashboard/DashboardNavigationProgress";
import { USER_ROLES, type UserRole } from "@/lib/auth/constants";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

type DashboardSidebarProps = {
    role: UserRole | null;
};

type NavigationItem = {
    label: string;
    href?: string;
};

const navigationItems: NavigationItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Feedback", href: "/dashboard/feedback" },
    { label: "Tables", href: "/dashboard/tables" },
    { label: "QR Codes", href: "/dashboard/qr-codes" },
    { label: "Cài đặt", href: "/dashboard/settings" },
];

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

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

        startTransition(() => {
            router.push(href);
        });
    };

    const isOwner = role === USER_ROLES.OWNER;

    return (
        <>
            <DashboardNavigationProgress isLoading={isPending} />

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
                    sx={{ gap: 0.5 }}
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

                        if (item.href === "/dashboard" && active) {
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
                                fullWidth
                                onClick={() => handleNavigation(item.href!)}
                                sx={buttonSx}
                            >
                                {item.label}
                            </Button>
                        );
                    })}

                    {/* Owner only */}
                    {isOwner && (
                        <Button
                            component={Link}
                            href="/dashboard/users-roles"
                            fullWidth
                            onClick={() =>
                                handleNavigation("/dashboard/users-roles")
                            }
                            sx={{
                                justifyContent: "flex-start",
                                px: 1.5,
                                py: 1.25,
                                borderRadius: 1.5,
                                color: isActive("/dashboard/users-roles")
                                    ? "#193B56"
                                    : "#667085",
                                backgroundColor: isActive(
                                    "/dashboard/users-roles",
                                )
                                    ? "#eef4f8"
                                    : "transparent",
                                fontWeight: isActive("/dashboard/users-roles")
                                    ? 700
                                    : 500,
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: isActive(
                                        "/dashboard/users-roles",
                                    )
                                        ? "#eef4f8"
                                        : "#f8fafc",
                                },
                            }}
                        >
                            Users &amp; Roles
                        </Button>
                    )}
                </Stack>
            </Box>
        </>
    );
}
