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
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
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
                px: { xs: 0, sm: 1 },
                py: 1.5,
                mb: 3,
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(16, 24, 40, 0.03)",
            }}
        >
            {/* Restaurant identity */}
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        color: "#193B56",
                        backgroundColor: "#eef4f8",
                    }}
                >
                    <Box
                        component="svg"
                        viewBox="0 0 24 24"
                        sx={{ width: 23, height: 23 }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 10h18" />
                        <path d="M5 10l1.5-6h11L19 10" />
                        <path d="M5 10v10h14V10" />
                        <path d="M9 20v-6h6v6" />
                    </Box>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: 0.7,
                            color: "#667085",
                            textTransform: "uppercase",
                            mb: 0.25,
                        }}
                    >
                        QR Feedback
                    </Typography>

                    <Typography
                        title={restaurantName || "Restaurant"}
                        sx={{
                            fontSize: { xs: 16, sm: 19 },
                            lineHeight: 1.35,
                            fontWeight: 700,
                            color: "#193B56",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {restaurantName || "Restaurant"}
                    </Typography>
                </Box>
            </Stack>

            {/* Account menu */}
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        display: { xs: "none", sm: "block" },
                        textAlign: "right",
                        mr: 1.25,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            lineHeight: 1.5,
                            fontWeight: 600,
                            color: "#344054",
                        }}
                    >
                        {displayName}
                    </Typography>

                    {roleLabel && (
                        <Typography
                            sx={{
                                display: "inline-block",
                                mt: 0.25,
                                px: 1,
                                py: 0.125,
                                borderRadius: 1,
                                backgroundColor: "#eef4f8",
                                color: "#193B56",
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        >
                            {roleLabel}
                        </Typography>
                    )}
                </Box>

                <IconButton
                    onClick={handleOpenMenu}
                    aria-label="Open account menu"
                    aria-controls={isMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                    sx={{
                        p: 0.5,
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: "#f2f4f7",
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#193B56",
                            color: "#ffffff",
                            fontSize: 15,
                            fontWeight: 700,
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
                                mt: 1,
                                minWidth: 220,
                                border: "1px solid #eaecf0",
                                borderRadius: 2,
                                boxShadow: "0 8px 24px rgba(16, 24, 40, 0.10)",
                            },
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            {displayName}
                        </Typography>

                        {roleLabel && (
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 12,
                                    color: "#667085",
                                }}
                            >
                                {roleLabel}
                            </Typography>
                        )}

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 12,
                                color: "#667085",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {restaurantName || "Restaurant"}
                        </Typography>
                    </Box>

                    <Divider />

                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            mx: 0.75,
                            my: 0.5,
                            borderRadius: 1,
                            color: "#b42318",
                            fontSize: 14,
                            "&:hover": {
                                backgroundColor: "#fef3f2",
                            },
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Stack>
        </Stack>
    );
}
