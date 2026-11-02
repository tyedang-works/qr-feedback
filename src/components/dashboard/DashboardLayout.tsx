"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import ThemeToggle from "@/components/common/theme/ThemeToggle";
import { USER_ROLES } from "@/lib/auth/constants";
import type { UserContext } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/browser";
import { animatedAvatarRingSx } from "@/styles/avatar.styles";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu as MenuIcon,
    Settings2,
    UserKey,
    UserRound,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChangePasswordDialog from "../account/ChangePasswordDialog";
import LanguageToggle from "../common/language/LanguageToggle";
import DashboardFooter from "./DashboardFooter";
import { useDashboardLoading } from "./DashboardLoadingProvider";
import DashboardSidebar from "./DashboardSidebar";

type DashboardLayoutProps = {
    children: React.ReactNode;
    userContext: UserContext | null;
    feedbackEmail: string;
};

export default function DashboardLayout({
    children,
    userContext,
    feedbackEmail,
}: DashboardLayoutProps) {
    const router = useRouter();
    const { t } = useTranslation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const role = userContext?.role ?? null;
    const fullName = userContext?.fullName ?? null;
    const restaurantName = userContext?.restaurantName ?? null;
    const logoUrl = userContext?.logoUrl ?? null;
    const avatarUrl = userContext?.avatarUrl ?? null;

    const displayName = fullName?.trim() || "Admin";
    const initial = displayName.charAt(0).toUpperCase();

    const sidebarProps = {
        role,
        fullName,
        restaurantName,
        logoUrl,
        avatarUrl,
    };

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((current) => !current);
    };

    const handleOpenProfile = () => {
        setIsProfileOpen(true);
    };

    const handleCloseProfile = () => {
        setIsProfileOpen(false);
    };

    const { startNavigation } = useDashboardLoading();

    const handleProfileNavigation = (href: string) => {
        handleCloseProfile();
        startNavigation();
        router.push(href);
    };

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);
        handleCloseProfile();

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

    return (
        <>
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
                        width: isSidebarCollapsed
                            ? "var(--sidebar-collapsed-width, 72px)"
                            : "var(--sidebar-width, 260px)",
                        height: "100dvh",
                        overflow: "visible",
                        zIndex: 1101,
                        transition: "width 180ms ease",
                    }}
                >
                    <DashboardSidebar
                        {...sidebarProps}
                        collapsed={isSidebarCollapsed}
                    />

                    <IconButton
                        onClick={handleToggleSidebar}
                        aria-expanded={!isSidebarCollapsed}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 24,
                            right: 0,
                            transform: "translateX(50%)",
                            zIndex: 1102,
                            width: 28,
                            height: 28,
                            bgcolor: "var(--color-surface, #FFFFFF)",
                            color: "var(--color-text-secondary, #6B7280)",
                            border: "1px solid var(--color-border, #F0F1F3)",
                            borderRadius: "50%",
                            "&:hover": {
                                bgcolor: "var(--color-surface-hover, #F9FAFB)",
                            },
                        }}
                    >
                        {isSidebarCollapsed ? (
                            <ChevronRight size={15} strokeWidth={1.8} />
                        ) : (
                            <ChevronLeft size={15} strokeWidth={1.8} />
                        )}
                    </IconButton>
                </Box>

                <Box
                    component="main"
                    className="dashboard-main"
                    sx={{
                        flex: "1 1 0%",
                        minWidth: 0,
                        minHeight: "100dvh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        component="header"
                        className="dashboard-navbar"
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1000,
                            flexShrink: 0,
                            minHeight: { xs: 64, md: 72 },
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: {
                                xs: 2,
                                sm: 3,
                                lg: 4,
                                xl: 6,
                            },
                            bgcolor: "var(--color-background, #FFFFFF)",
                            borderBottom:
                                "1px solid var(--color-border, #F0F1F3)",
                        }}
                    >
                        <IconButton
                            onClick={() => setIsMobileSidebarOpen(true)}
                            aria-label={t("account", "openMobileMenu")}
                            aria-expanded={isMobileSidebarOpen}
                            size="small"
                            sx={{
                                display: { xs: "inline-flex", md: "none" },
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                color: "var(--color-text-secondary, #6B7280)",
                                borderRadius: 1.5,
                                "&:hover": {
                                    bgcolor:
                                        "var(--color-surface-hover, #F9FAFB)",
                                },
                            }}
                        >
                            <MenuIcon size={21} strokeWidth={1.8} />
                        </IconButton>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    lineHeight: 1.2,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    paddingTop: { xs: 0, md: "6px" },
                                }}
                            >
                                {fullName}
                            </Typography>
                        </Box>

                        <LanguageToggle />

                        <ThemeToggle />

                        <Tooltip title={t("account", "account")}>
                            <IconButton
                                onClick={handleOpenProfile}
                                aria-label={t("account", "openAccountMenu")}
                                aria-haspopup="menu"
                                size="small"
                                sx={{
                                    width: 50,
                                    height: 50,
                                    p: 0,
                                    flexShrink: 0,
                                    border: "1px solid var(--color-border, #F0F1F3)",
                                    borderRadius: "50%",
                                }}
                            >
                                <Box
                                    sx={{
                                        ...animatedAvatarRingSx,
                                        width: 48,
                                        height: 48,
                                    }}
                                >
                                    <Avatar
                                        src={avatarUrl ?? undefined}
                                        alt={displayName}
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            bgcolor:
                                                "var(--color-primary, #193B56)",
                                            color: "var(--color-surface, #FFF)",
                                            fontSize: 13,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {initial}
                                    </Avatar>
                                </Box>
                            </IconButton>
                        </Tooltip>

                        <Drawer
                            anchor="right"
                            open={isProfileOpen}
                            onClose={handleCloseProfile}
                            transitionDuration={{ enter: 280, exit: 220 }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        width: 320,
                                        maxWidth: "100vw",
                                        height: "100dvh",
                                        display: "flex",
                                        flexDirection: "column",
                                        overflow: "hidden",
                                        border: "none",
                                        borderLeft:
                                            "1px solid var(--color-border, #374151)",
                                        borderRadius: 0,
                                        bgcolor:
                                            "var(--color-surface, #FFFFFF)",
                                        color: "var(--color-text-primary, #111827)",
                                        backgroundImage: "none",
                                        boxShadow:
                                            "-12px 0 40px rgba(0, 0, 0, 0.12)",
                                    },
                                },
                                backdrop: {
                                    sx: {
                                        bgcolor: "rgba(0, 0, 0, 0.35)",
                                    },
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    px: 2,
                                    pt: 2,
                                    pb: 1,
                                }}
                            >
                                <IconButton
                                    onClick={handleCloseProfile}
                                    aria-label={t(
                                        "account",
                                        "closeProfilePanel",
                                    )}
                                    size="small"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        color: "var(--color-text-secondary, #6B7280)",
                                        borderRadius: 1.5,
                                        "&:hover": {
                                            bgcolor:
                                                "var(--color-surface-hover, #F9FAFB)",
                                        },
                                    }}
                                >
                                    <X size={20} strokeWidth={1.8} />
                                </IconButton>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    px: 3,
                                    pt: 2,
                                    pb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        ...animatedAvatarRingSx,
                                        width: 104,
                                        height: 104,
                                        mb: 3,
                                    }}
                                >
                                    <Avatar
                                        src={avatarUrl ?? undefined}
                                        alt={displayName}
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            bgcolor:
                                                "var(--color-surface-hover, #F9FAFB)",
                                            color: "var(--color-text-primary, #111827)",
                                            fontSize: 30,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {initial}
                                    </Avatar>
                                </Box>

                                <Typography
                                    title={displayName}
                                    sx={{
                                        maxWidth: "100%",
                                        fontSize: 17,
                                        lineHeight: 1.5,
                                        fontWeight: 700,
                                        textAlign: "center",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {displayName}
                                </Typography>

                                <Typography
                                    title={userContext?.email ?? ""}
                                    sx={{
                                        mt: 0.5,
                                        maxWidth: "100%",
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        color: "var(--color-text-secondary, #6B7280)",
                                        textAlign: "center",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {userContext?.email ||
                                        t("common", "noEmail")}
                                </Typography>
                            </Box>

                            <Divider
                                sx={{
                                    borderColor: "var(--color-border, #F0F1F3)",
                                }}
                            />

                            <List
                                disablePadding
                                sx={{
                                    px: 1.5,
                                    py: 1.5,
                                }}
                            >
                                <ListItemButton
                                    onClick={() =>
                                        handleProfileNavigation(
                                            "/dashboard/profile",
                                        )
                                    }
                                    sx={{
                                        minHeight: 46,
                                        px: 1.5,
                                        gap: 1.5,
                                        borderRadius: 1.5,
                                        fontSize: 14,
                                        color: "var(--color-text-primary, #111827)",
                                        "&:hover": {
                                            bgcolor:
                                                "var(--color-surface-hover, #F9FAFB)",
                                        },
                                    }}
                                >
                                    <UserRound
                                        size={19}
                                        strokeWidth={1.8}
                                        color="var(--color-text-secondary, #6B7280)"
                                    />
                                    {t("common", "profile")}
                                </ListItemButton>

                                <ListItemButton
                                    onClick={() => {
                                        handleCloseProfile();
                                        setIsChangePasswordOpen(true);
                                    }}
                                    sx={{
                                        minHeight: 46,
                                        px: 1.5,
                                        gap: 1.5,
                                        borderRadius: 1.5,
                                        fontSize: 14,
                                        color: "var(--color-text-primary, #111827)",
                                        "&:hover": {
                                            bgcolor:
                                                "var(--color-surface-hover, #F9FAFB)",
                                        },
                                    }}
                                >
                                    <UserKey
                                        size={19}
                                        strokeWidth={1.8}
                                        color="var(--color-text-secondary, #6B7280)"
                                    />
                                    {t("common", "changePassword")}
                                </ListItemButton>

                                {role === USER_ROLES.OWNER && (
                                    <ListItemButton
                                        onClick={() =>
                                            handleProfileNavigation(
                                                "/dashboard/settings",
                                            )
                                        }
                                        sx={{
                                            minHeight: 46,
                                            px: 1.5,
                                            gap: 1.5,
                                            borderRadius: 1.5,
                                            fontSize: 14,
                                            color: "var(--color-text-primary, #111827)",
                                            "&:hover": {
                                                bgcolor:
                                                    "var(--color-surface-hover, #F9FAFB)",
                                            },
                                        }}
                                    >
                                        <Settings2
                                            size={19}
                                            strokeWidth={1.8}
                                            color="var(--color-text-secondary, #6B7280)"
                                        />
                                        {t("common", "settings")}
                                    </ListItemButton>
                                )}
                            </List>

                            <Box sx={{ flex: 1, minHeight: 16 }} />

                            <Divider
                                sx={{
                                    borderColor: "var(--color-border, #F0F1F3)",
                                }}
                            />

                            <Box sx={{ p: 2 }}>
                                <Button
                                    fullWidth
                                    disabled={isLoggingOut}
                                    onClick={handleLogout}
                                    startIcon={<LogOut size={17} />}
                                    sx={{
                                        minHeight: 46,
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "#FFAC82",
                                        bgcolor: "rgba(255, 86, 48, 0.16)",
                                        "&:hover": {
                                            bgcolor: "rgba(255, 86, 48, 0.24)",
                                        },
                                    }}
                                >
                                    {isLoggingOut
                                        ? t("common", "loggingOut")
                                        : t("common", "logout")}
                                </Button>
                            </Box>
                        </Drawer>
                    </Box>

                    <Box
                        className="dashboard-content"
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            px: {
                                xs: 2,
                                sm: 3,
                                lg: 4,
                                xl: 6,
                            },
                            pt: {
                                xs: 2.5,
                                md: 3,
                            },
                            pb: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 1440,
                                mx: "auto",
                            }}
                        >
                            {children}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 3,
                                lg: 4,
                                xl: 6,
                            },
                            pb: {
                                xs: 2,
                                md: 2.5,
                            },
                        }}
                    >
                        <DashboardFooter email={feedbackEmail} />
                    </Box>
                </Box>

                <Drawer
                    anchor="left"
                    open={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                    transitionDuration={{ enter: 220, exit: 180 }}
                    slotProps={{
                        paper: {
                            sx: {
                                width: "var(--sidebar-width, 260px)",
                                maxWidth: "85vw",
                                height: "100dvh",
                                overflow: "hidden",
                                bgcolor: "var(--color-surface, #FFFFFF)",
                                borderRight:
                                    "1px solid var(--color-border, #F0F1F3)",
                            },
                        },
                    }}
                >
                    <DashboardSidebar
                        {...sidebarProps}
                        collapsed={false}
                        onNavigate={() => setIsMobileSidebarOpen(false)}
                    />
                </Drawer>
            </Box>

            <ChangePasswordDialog
                open={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </>
    );
}
