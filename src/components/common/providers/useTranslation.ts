"use client";

import { useLanguage } from "./LanguageProvider";

export function useTranslation() {
    const { t, locale } = useLanguage();

    return { t, locale };
}
