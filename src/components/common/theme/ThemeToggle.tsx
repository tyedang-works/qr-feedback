"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/components/common/providers/MuiThemeProvider";

export default function ThemeToggle() {
    const { mode, toggleMode } = useThemeMode();
    const isDark = mode === "dark";

    return (
        <Tooltip
            title={isDark ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"}
        >
            <IconButton
                onClick={toggleMode}
                aria-label={
                    isDark
                        ? "Chuyển sang giao diện sáng"
                        : "Chuyển sang giao diện tối"
                }
                sx={{
                    width: 38,
                    height: 38,
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 2,
                    bgcolor: "var(--color-surface)",
                    transition: "background-color 150ms ease, color 150ms ease",
                    "&:hover": {
                        bgcolor: "var(--color-surface-hover)",
                        color: "var(--color-text-primary)",
                    },
                }}
            >
                {isDark ? (
                    <Sun size={18} strokeWidth={1.8} />
                ) : (
                    <Moon size={18} strokeWidth={1.8} />
                )}
            </IconButton>
        </Tooltip>
    );
}
