"use client";

import { Box, Tooltip, Typography } from "@mui/material";

import { useLanguage } from "@/components/common/providers/LanguageProvider";

type LanguageToggleProps = {
    forceLight?: boolean;
};

const FLAG_URLS = {
    vi: "/assets/flags/VN.svg",
    en: "/assets/flags/GB.svg",
} as const;

const LIGHT_MODE_COLORS = {
    background: "#ffffff",
    backgroundHover: "#f9fafb",
    backgroundActive: "#f3f4f6",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    borderHover: "#d0d5dd",
    focus: "#193b56",
} as const;

export default function LanguageToggle({
    forceLight = false,
}: LanguageToggleProps) {
    const { locale, setLocale } = useLanguage();

    const nextLocale = locale === "en" ? "vi" : "en";

    const switchLabel =
        locale === "vi" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese";

    const colors = forceLight
        ? LIGHT_MODE_COLORS
        : {
              background: "var(--color-surface)",
              backgroundHover: "var(--color-surface-hover)",
              backgroundActive: "var(--color-surface-active)",
              text: "var(--color-text-primary)",
              textSecondary: "var(--color-text-secondary)",
              border: "var(--color-border)",
              borderHover: "var(--color-input-border-hover)",
              focus: "var(--color-input-focus)",
          };

    return (
        <Tooltip title={switchLabel} arrow>
            <Box
                component="button"
                type="button"
                onClick={() => setLocale(nextLocale)}
                aria-label={switchLabel}
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    height: 38,
                    px: 1.5,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "999px",
                    backgroundColor: colors.background,
                    color: colors.text,
                    cursor: "pointer",
                    outline: "none",
                    transition:
                        "background-color 150ms ease, border-color 150ms ease",

                    "&:hover": {
                        backgroundColor: colors.backgroundHover,
                        borderColor: colors.borderHover,
                    },

                    "&:active": {
                        backgroundColor: colors.backgroundActive,
                    },

                    "&:focus-visible": {
                        outline: `2px solid ${colors.focus}`,
                        outlineOffset: 2,
                    },
                }}
            >
                <Box
                    component="img"
                    src={FLAG_URLS[locale]}
                    alt=""
                    draggable={false}
                    sx={{
                        display: "block",
                        width: 20,
                        height: 14,
                        objectFit: "cover",
                        borderRadius: "2px",
                        flexShrink: 0,
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />

                <Typography
                    component="span"
                    sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: colors.text,
                    }}
                >
                    {locale.toUpperCase()}
                </Typography>

                <Box
                    sx={{
                        width: "1px",
                        height: 16,
                        backgroundColor: colors.border,
                        flexShrink: 0,
                    }}
                />

                <Typography
                    component="span"
                    sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: 1,
                        color: colors.textSecondary,
                    }}
                >
                    {nextLocale.toUpperCase()}
                </Typography>
            </Box>
        </Tooltip>
    );
}
