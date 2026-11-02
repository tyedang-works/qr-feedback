"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/components/common/providers/MuiThemeProvider";

export default function ThemeToggle() {
    const { mode, toggleMode } = useThemeMode();
    const isDark = mode === "dark";

    return (
        <Tooltip
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            arrow
        >
            <IconButton
                onClick={toggleMode}
                aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                }
                sx={{
                    width: 38,
                    height: 38,
                    p: 0,
                    color: "var(--color-text-secondary)",
                    border: "none",
                    borderRadius: "50%",
                    bgcolor: "transparent",
                    transition: "background-color 150ms ease, color 150ms ease",

                    "&:hover": {
                        bgcolor: "var(--color-surface-hover)",
                        color: "var(--color-text-primary)",
                    },

                    "&:active": {
                        bgcolor: "var(--color-surface-active)",
                    },
                }}
            >
                {isDark ? (
                    <Sun size={19} strokeWidth={1.8} />
                ) : (
                    <Moon size={19} strokeWidth={1.8} />
                )}
            </IconButton>
        </Tooltip>
    );
}
