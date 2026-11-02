"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Languages } from "lucide-react";

import { useLanguage } from "@/components/common/providers/LanguageProvider";

export default function LanguageToggle() {
    const { locale, setLocale } = useLanguage();

    const nextLocale = locale === "en" ? "vi" : "en";

    return (
        <Tooltip
            title={
                locale === "en" ? "Chuyển sang tiếng Việt" : "Switch to English"
            }
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
                <Languages size={18} strokeWidth={1.8} />
            </IconButton>
        </Tooltip>
    );
}
