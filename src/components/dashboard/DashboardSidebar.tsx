"use client";

import { USER_ROLES, type UserRole } from "@/lib/auth/constants";
import { animatedAvatarRingSx } from "@/styles/avatar.styles";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    MessagesSquare,
    QrCode,
    Table2,
    UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardLoading } from "./DashboardLoadingProvider";

type DashboardSidebarProps = {
    role: UserRole | null;
    restaurantName: string | null;
    logoUrl: string | null;
    onNavigate?: () => void;
    collapsed?: boolean;
};

type NavigationItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

type NavigationGroup = {
    label: string;
    items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
    {
        label: "Tổng quan",
        items: [
            {
                label: "Bảng điều khiển",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Quản lý nhà hàng",
        items: [
            {
                label: "Phản hồi",
                href: "/dashboard/feedback",
                icon: MessagesSquare,
            },
            {
                label: "Bàn ăn",
                href: "/dashboard/tables",
                icon: Table2,
            },
            {
                label: "Mã QR",
                href: "/dashboard/qr-codes",
                icon: QrCode,
            },
        ],
    },
    {
        label: "Quản lý người dùng",
        items: [
            {
                label: "Người dùng & phân quyền",
                href: "/dashboard/users-roles",
                icon: UsersRound,
            },
        ],
    },
];

const DEFAULT_RESTAURANT_LOGO = "/assets/default-restaurant-logo.png";

export default function DashboardSidebar({
    role,
    restaurantName,
    onNavigate,
    logoUrl,
    collapsed = false,
}: DashboardSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { startNavigation } = useDashboardLoading();

    const isOwner = role === USER_ROLES.OWNER;
    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const handleNavigation = (href: string) => {
        if (href === pathname) {
            onNavigate?.();
            return;
        }

        onNavigate?.();
        startNavigation();
        router.push(href);
    };

    const OWNER_ONLY_ROUTES = ["/dashboard/settings", "/dashboard/users-roles"];

    const visibleGroups = navigationGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                if (OWNER_ONLY_ROUTES.includes(item.href)) {
                    return isOwner;
                }

                if (item.href === "/dashboard/feedback") {
                    return role !== USER_ROLES.MANAGER;
                }

                return true;
            }),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <Box
            component="aside"
            sx={{
                width: "100%",
                minWidth: 0,
                height: "100dvh",
                boxSizing: "border-box",
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                px: collapsed ? 1 : 1.75,
                py: 2.5,
                scrollbarWidth: "thin",
                scrollbarColor: "var(--color-border, #374151) transparent",
                color: "var(--color-text-primary, #111827)",
                bgcolor: "var(--color-surface, #FFFFFF)",
                borderRight: "1px solid var(--color-border, #F0F1F3)",
            }}
        >
            {/* main logo */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    px: collapsed
                        ? 0.5
                        : {
                              xs: 1.5,
                              md: 2,
                          },
                    pt: collapsed
                        ? 2
                        : {
                              xs: 2,
                              md: 3,
                          },
                    pb: collapsed
                        ? 0
                        : {
                              xs: 2,
                              md: 2.5,
                          },
                }}
            >
                <Box
                    sx={{
                        ...animatedAvatarRingSx,
                        width: collapsed
                            ? 48
                            : {
                                  xs: 72,
                                  md: 108,
                              },
                        height: collapsed
                            ? 48
                            : {
                                  xs: 72,
                                  md: 108,
                              },
                        mb: collapsed
                            ? 0
                            : {
                                  xs: 1,
                                  md: 1.5,
                              },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                        borderRadius: "50%",
                    }}
                >
                    <Box
                        component="img"
                        src={logoUrl || DEFAULT_RESTAURANT_LOGO}
                        alt={restaurantName || "Logo nhà hàng"}
                        onError={(event) => {
                            const image = event.currentTarget;

                            if (image.src.endsWith(DEFAULT_RESTAURANT_LOGO)) {
                                image.style.visibility = "hidden";
                                return;
                            }

                            image.src = DEFAULT_RESTAURANT_LOGO;
                        }}
                        sx={{
                            width: collapsed
                                ? 40
                                : {
                                      xs: 64,
                                      md: 100,
                                  },
                            height: collapsed
                                ? 40
                                : {
                                      xs: 64,
                                      md: 100,
                                  },
                            flexShrink: 0,
                            objectFit: "contain",
                            borderRadius: "50%",
                            bgcolor: "var(--color-surface)",
                            display: "block",
                        }}
                    />
                </Box>

                {!collapsed && (
                    <Typography
                        title={restaurantName ?? ""}
                        sx={{
                            width: "100%",
                            minWidth: 0,
                            fontSize: {
                                xs: 14,
                                md: 18,
                            },
                            lineHeight: 1.5,
                            fontWeight: 700,
                            textAlign: "center",
                            overflowWrap: "anywhere",
                            color: "var(--color-text-primary, #111827)",
                        }}
                    >
                        {restaurantName ?? "Nhà hàng"}
                    </Typography>
                )}
            </Box>

            <Divider
                sx={{
                    my: 2.5,
                    borderColor: "var(--color-border, #F0F1F3)",
                }}
            />

            {/* navigation */}
            <Stack
                component="nav"
                aria-label="Dashboard navigation"
                sx={{
                    flex: 1,
                    gap: collapsed ? 1.5 : 2.5,
                }}
            >
                {visibleGroups.map((group) => (
                    <Stack
                        key={group.label}
                        sx={{
                            gap: 0.5,
                        }}
                    >
                        {!collapsed && (
                            <Typography
                                component="h2"
                                sx={{
                                    px: 1.25,
                                    mb: 0.5,
                                    fontSize: 10.5,
                                    lineHeight: 1.5,
                                    fontWeight: 650,
                                    letterSpacing: "0.65px",
                                    textTransform: "uppercase",
                                    color: "var(--color-text-muted, #9CA3AF)",
                                }}
                            >
                                {group.label}
                            </Typography>
                        )}

                        <Stack
                            sx={{
                                gap: 0.5,
                            }}
                        >
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                const Icon = item.icon;

                                return (
                                    <Button
                                        key={item.href}
                                        fullWidth
                                        disableElevation
                                        title={
                                            collapsed ? item.label : undefined
                                        }
                                        aria-label={item.label}
                                        aria-current={
                                            active ? "page" : undefined
                                        }
                                        onClick={() =>
                                            handleNavigation(item.href)
                                        }
                                        startIcon={
                                            <Icon
                                                size={19}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />
                                        }
                                        sx={{
                                            minWidth: 0,
                                            minHeight: 42,
                                            justifyContent: collapsed
                                                ? "center"
                                                : "flex-start",
                                            px: collapsed ? 0 : 1.5,
                                            py: 1,
                                            borderRadius: 1.5,
                                            textAlign: "left",
                                            fontSize: 13,
                                            lineHeight: 1.5,
                                            fontWeight: active ? 650 : 450,
                                            textTransform: "none",
                                            color: "var(--color-text-primary, #111827)",
                                            bgcolor: active
                                                ? "var(--color-surface-active, #F3F4F6)"
                                                : "transparent",
                                            transition:
                                                "background-color 150ms ease",
                                            "& .MuiButton-startIcon": {
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mr: collapsed ? 0 : 1.5,
                                                ml: 0,
                                                color: active
                                                    ? "var(--color-primary, #111827)"
                                                    : "var(--color-text-secondary, #6B7280)",
                                            },
                                            "&:hover": {
                                                bgcolor: active
                                                    ? "var(--color-surface-active, #F3F4F6)"
                                                    : "var(--color-surface-hover, #F9FAFB)",
                                            },
                                            "&:focus-visible": {
                                                outline:
                                                    "2px solid var(--color-text-muted, #9CA3AF)",
                                                outlineOffset: 2,
                                            },
                                        }}
                                    >
                                        {!collapsed && item.label}
                                    </Button>
                                );
                            })}
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
