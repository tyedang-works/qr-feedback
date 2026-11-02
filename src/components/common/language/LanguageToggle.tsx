"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import { useLanguage } from "@/components/common/providers/LanguageProvider";

const FLAG_URLS = {
    vi: "/assets/flags/VN.svg",
    en: "/assets/flags/GB.svg",
} as const;

export default function LanguageToggle() {
    const { locale, setLocale } = useLanguage();

    const nextLocale = locale === "en" ? "vi" : "en";

    return (
        <Tooltip
            title={
                locale === "en"
                    ? "Switch to Vietnamese"
                    : "Chuyển sang tiếng Anh"
            }
            arrow
        >
            <IconButton
                onClick={() => setLocale(nextLocale)}
                aria-label={
                    locale === "en"
                        ? "Switch to Vietnamese"
                        : "Switch to English"
                }
                sx={{
                    width: 38,
                    height: 38,
                    p: 0,
                    border: "none",
                    borderRadius: "50%",
                    bgcolor: "transparent",
                    transition: "background-color 150ms ease",

                    "&:hover": {
                        bgcolor: "var(--color-surface-hover)",
                    },

                    "&:active": {
                        bgcolor: "var(--color-surface-active)",
                    },
                }}
            >
                <Box
                    component="img"
                    src={FLAG_URLS[locale]}
                    alt={locale === "vi" ? "Vietnamese" : "English"}
                    draggable={false}
                    sx={{
                        display: "block",
                        width: 26,
                        height: 18,
                        objectFit: "cover",
                        borderRadius: "3px",
                        flexShrink: 0,
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />
            </IconButton>
        </Tooltip>
    );
}
