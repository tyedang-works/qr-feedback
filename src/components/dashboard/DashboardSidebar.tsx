"use client";

import DashboardNavigationProgress from "@/components/dashboard/DashboardNavigationProgress";
import { USER_ROLES, type UserRole } from "@/lib/auth/constants";
import { createClient } from "@/lib/supabase/browser";
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    LogOut,
    MessagesSquare,
    MoreHorizontal,
    QrCode,
    Settings2,
    Table2,
    UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useState, useTransition } from "react";
import Logo from "../common/Logo";

type DashboardSidebarProps = {
    role: UserRole | null;
    fullName: string | null;
    restaurantName: string | null;
    logoUrl: string | null;
    onNavigate?: () => void;
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
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Quản lý nhà hàng",
        items: [
            {
                label: "Feedback",
                href: "/dashboard/feedback",
                icon: MessagesSquare,
            },
            {
                label: "Tables",
                href: "/dashboard/tables",
                icon: Table2,
            },
            {
                label: "QR Codes",
                href: "/dashboard/qr-codes",
                icon: QrCode,
            },
        ],
    },
    {
        label: "Cài đặt hệ thống",
        items: [
            {
                label: "Cài đặt",
                href: "/dashboard/settings",
                icon: Settings2,
            },
            {
                label: "Users & Roles",
                href: "/dashboard/users-roles",
                icon: UsersRound,
            },
        ],
    },
];

export default function DashboardSidebar({
    role,
    fullName,
    restaurantName,
    onNavigate,
    logoUrl,
}: DashboardSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(
        null,
    );
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isOwner = role === USER_ROLES.OWNER;
    const isAccountMenuOpen = Boolean(accountAnchor);

    const displayName = fullName?.trim() || "Admin";
    const displayRestaurantName = restaurantName?.trim() || "Restaurant";
    const initial = displayName.charAt(0).toUpperCase();

    const roleLabels: Partial<Record<UserRole, string>> = {
        [USER_ROLES.OWNER]: "Owner",
    };

    const roleLabel = role ? (roleLabels[role] ?? role) : "";

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

        startTransition(() => {
            router.push(href);
        });
    };

    const handleOpenAccountMenu = (event: MouseEvent<HTMLElement>) => {
        setAccountAnchor(event.currentTarget);
    };

    const handleCloseAccountMenu = () => {
        setAccountAnchor(null);
    };

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);
        handleCloseAccountMenu();

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Failed to log out:", error);
                setIsLoggingOut(false);
                return;
            }

            router.replace("/login");
            router.refresh();
        } catch (error) {
            console.error("Failed to log out:", error);
            setIsLoggingOut(false);
        }
    };

    const visibleGroups = navigationGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => item.href !== "/dashboard/users-roles" || isOwner,
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <>
            <DashboardNavigationProgress isLoading={isPending} />

            <Box
                component="aside"
                sx={{
                    width: "var(--sidebar-width, 256px)",
                    height: "100dvh",
                    boxSizing: "border-box",
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    px: 1.75,
                    py: 2.5,
                    color: "var(--color-text-primary, #111827)",
                    bgcolor: "var(--color-surface, #FFFFFF)",
                    borderRight: "1px solid var(--color-border, #F0F1F3)",
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.25,
                        px: 1,
                        minHeight: 48,
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            borderRadius: 1.5,
                        }}
                    >
                        {logoUrl ? (
                            <Box
                                component="img"
                                src={logoUrl}
                                alt={`Logo ${displayRestaurantName}`}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        ) : (
                            <Logo size={36} />
                        )}
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                mb: 0.25,
                                fontSize: 10,
                                lineHeight: 1.5,
                                fontWeight: 650,
                                letterSpacing: "0.8px",
                                color: "var(--color-text-muted, #9CA3AF)",
                                textTransform: "uppercase",
                            }}
                        >
                            QR Feedback
                        </Typography>

                        <Typography
                            title={displayRestaurantName}
                            sx={{
                                fontSize: 16,
                                lineHeight: 1.45,
                                fontWeight: 700,
                                letterSpacing: "-0.2px",
                                color: "var(--color-text-primary, #111827)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {displayRestaurantName}
                        </Typography>
                    </Box>
                </Stack>
                <Divider
                    sx={{
                        my: 2.5,
                        borderColor: "var(--color-border, #F0F1F3)",
                    }}
                />
                <Stack
                    component="nav"
                    aria-label="Dashboard navigation"
                    sx={{
                        flex: 1,
                        gap: 2.75,
                    }}
                >
                    {visibleGroups.map((group) => (
                        <Stack
                            key={group.label}
                            sx={{
                                gap: 0.75,
                            }}
                        >
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
                                                minHeight: 42,
                                                justifyContent: "flex-start",
                                                px: 1.5,
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
                                                    mr: 1.5,
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
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>

                <Divider
                    sx={{
                        mt: 2,
                        mb: 1.5,
                        borderColor: "var(--color-border, #F0F1F3)",
                    }}
                />
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 0,
                        px: 0.5,
                        py: 0.5,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            bgcolor: "var(--color-primary, #111827)",
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontWeight: 650,
                        }}
                    >
                        {initial}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            title={displayName}
                            noWrap
                            sx={{
                                fontSize: 13,
                                lineHeight: 1.5,
                                fontWeight: 650,
                                color: "var(--color-text-primary, #111827)",
                            }}
                        >
                            {displayName}
                        </Typography>

                        {roleLabel && (
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    bgcolor: "#EEF4F8",
                                    color: "#193B56",
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                    fontWeight: 600,
                                }}
                            >
                                {roleLabel}
                            </Box>
                        )}
                    </Box>

                    <IconButton
                        onClick={handleOpenAccountMenu}
                        aria-label="Mở menu tài khoản"
                        aria-controls={
                            isAccountMenuOpen ? "account-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={isAccountMenuOpen ? "true" : undefined}
                        size="small"
                        sx={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            color: "var(--color-text-secondary, #6B7280)",
                            borderRadius: 1.5,
                            "&:hover": {
                                bgcolor: "var(--color-surface-hover, #F9FAFB)",
                                color: "var(--color-text-primary, #111827)",
                            },
                        }}
                    >
                        <MoreHorizontal size={19} />
                    </IconButton>
                </Stack>

                <Menu
                    id="account-menu"
                    anchorEl={accountAnchor}
                    open={isAccountMenuOpen}
                    onClose={handleCloseAccountMenu}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                width: 236,
                                maxWidth: "calc(100vw - 24px)",
                                overflow: "hidden",
                                border: "1px solid #E5E7EB",
                                borderRadius: 3,
                                bgcolor: "#FFFFFF",
                                boxShadow:
                                    "0 12px 32px rgba(17, 24, 39, 0.10), 0 2px 6px rgba(17, 24, 39, 0.04)",
                                backgroundImage: "none",
                            },
                        },
                    }}
                >
                    <Box sx={{ px: 2, pt: 2, pb: 1.75 }}>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1.5,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 44,
                                    height: 44,
                                    flexShrink: 0,
                                    bgcolor: "#111827",
                                    color: "#FFFFFF",
                                    fontSize: 16,
                                    fontWeight: 700,
                                }}
                            >
                                {initial}
                            </Avatar>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    noWrap
                                    title={displayName}
                                    sx={{
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        fontWeight: 650,
                                        color: "#111827",
                                    }}
                                >
                                    {displayName}
                                </Typography>

                                {roleLabel && (
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            mt: 0.5,
                                            px: 1,
                                            py: 0.25,
                                            borderRadius: 1,
                                            bgcolor: "#EEF4F8",
                                            color: "#193B56",
                                            fontSize: 11,
                                            lineHeight: 1.5,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {roleLabel}
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: "#E5E7EB" }} />

                    <Box sx={{ p: 1 }}>
                        <MenuItem
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            sx={{
                                minHeight: 42,
                                px: 1.25,
                                py: 1,
                                gap: 1.25,
                                borderRadius: 1.5,
                                color: "#B42318",
                                fontSize: 13.5,
                                fontWeight: 550,
                                "&:hover": {
                                    bgcolor: "#FEF2F2",
                                },
                                "&:focus-visible": {
                                    outline: "2px solid #FECACA",
                                    outlineOffset: -2,
                                },
                            }}
                        >
                            <LogOut size={17} strokeWidth={1.8} />

                            <Typography
                                component="span"
                                sx={{
                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    color: "inherit",
                                }}
                            >
                                {isLoggingOut
                                    ? "Đang đăng xuất..."
                                    : "Đăng xuất"}
                            </Typography>
                        </MenuItem>
                    </Box>
                </Menu>
            </Box>
        </>
    );
}
