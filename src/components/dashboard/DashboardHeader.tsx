"use client";

import type { UserRole } from "@/lib/auth/constants";
import { createClient } from "@/lib/supabase/browser";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { LogOut, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MouseEvent } from "react";

type DashboardHeaderProps = {
    fullName: string | null;
    restaurantName: string | null;
    role: UserRole | null;
};

export default function DashboardHeader({
    fullName,
    restaurantName,
    role,
}: DashboardHeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isMenuOpen = Boolean(anchorEl);

    const displayName = fullName?.trim() || "Admin";
    const initial = displayName.charAt(0).toUpperCase();

    const roleLabel = role
        ? role
              .toLowerCase()
              .replaceAll("_", " ")
              .replace(/\b\w/g, (character) => character.toUpperCase())
        : "";

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleCloseMenu();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Failed to log out:", error);
            return;
        }

        router.push("/login");
        router.refresh();
    };

    return (
        <Stack
            component="header"
            sx={{
                position: "sticky",
                top: { xs: "64px", md: 0 },
                zIndex: 1000,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                minHeight: 76,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                mb: 0,
                bgcolor: "#FFFFFF",
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        color: "#111827",
                        bgcolor: "#F3F4F6",
                    }}
                >
                    <Store size={20} strokeWidth={1.8} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            mb: 0.25,
                            fontSize: 10.5,
                            lineHeight: 1.5,
                            fontWeight: 650,
                            letterSpacing: "0.8px",
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                        }}
                    >
                        QR Feedback
                    </Typography>

                    <Typography
                        title={restaurantName || "Restaurant"}
                        sx={{
                            fontSize: { xs: 15, sm: 18 },
                            lineHeight: 1.4,
                            fontWeight: 700,
                            letterSpacing: "-0.35px",
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {restaurantName || "Restaurant"}
                    </Typography>
                </Box>
            </Stack>

            {/* Account menu trigger */}
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexShrink: 0,
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: { xs: "none", sm: "block" },
                        textAlign: "right",
                        mr: 0.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13.5,
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
                                mt: 0.375,
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: "#F3F4F6",
                                color: "#374151",
                                fontSize: 10.5,
                                lineHeight: 1.4,
                                fontWeight: 600,
                            }}
                        >
                            {roleLabel}
                        </Box>
                    )}
                </Box>

                <IconButton
                    onClick={handleOpenMenu}
                    aria-label="Mở menu tài khoản"
                    aria-controls={isMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                    sx={{
                        p: 0.5,
                        borderRadius: 2,
                        bgcolor: isMenuOpen ? "#F3F4F6" : "transparent",
                        transition: "background-color 150ms ease",
                        "&:hover": {
                            bgcolor: "#F3F4F6",
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "#111827",
                            color: "#FFFFFF",
                            fontSize: 15,
                            fontWeight: 650,
                        }}
                    >
                        {initial}
                    </Avatar>
                </IconButton>

                <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 1.25,
                                width: 280,
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
                    {/* Account information */}
                    <Box
                        sx={{
                            px: 2,
                            pt: 2,
                            pb: 1.75,
                        }}
                    >
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
                                            bgcolor: "#F3F4F6",
                                            color: "#374151",
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

                    <Divider sx={{ borderColor: "#F0F1F3" }} />

                    {/* Restaurant information */}
                    <Box
                        sx={{
                            px: 2,
                            py: 1.75,
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                gap: 1.25,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 1.5,
                                    color: "#374151",
                                    bgcolor: "#FFFFFF",
                                }}
                            >
                                <Store size={17} strokeWidth={1.8} />
                            </Box>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    sx={{
                                        mb: 0.5,
                                        fontSize: 11,
                                        lineHeight: 1.5,
                                        fontWeight: 600,
                                        color: "#9CA3AF",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    Nhà hàng hiện tại
                                </Typography>

                                <Typography
                                    title={restaurantName || "Restaurant"}
                                    sx={{
                                        fontSize: 13,
                                        lineHeight: 1.6,
                                        fontWeight: 500,
                                        color: "#111827",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {restaurantName || "Restaurant"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: "#F0F1F3" }} />

                    {/* Logout action */}
                    <Box sx={{ p: 1 }}>
                        <MenuItem
                            onClick={handleLogout}
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
                                    bgcolor: "#FEF3F2",
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
                                Đăng xuất
                            </Typography>
                        </MenuItem>
                    </Box>
                </Menu>
            </Stack>
        </Stack>
    );
}
