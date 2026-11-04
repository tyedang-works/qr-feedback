"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import {
    translations,
    type Locale,
    type TranslationKey,
} from "@/i18n/translations";

import {
    feedbackToolbarTranslations,
    type FeedbackToolbarTranslationKey,
} from "@/i18n/feedback-toolbar.translations";

type LanguageContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (section: TranslationKey | "feedbackToolbar", key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
    children: React.ReactNode;
    initialLocale: Locale;
};

export default function LanguageProvider({
    children,
    initialLocale,
}: LanguageProviderProps) {
    const router = useRouter();
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = useCallback(
        (nextLocale: Locale) => {
            if (nextLocale === locale) return;

            setLocaleState(nextLocale);

            document.cookie = [
                `qr-locale=${nextLocale}`,
                "Path=/",
                "Max-Age=31536000",
                "SameSite=Lax",
            ].join("; ");

            router.refresh();
        },
        [locale, router],
    );

    const t = useCallback(
        (section: TranslationKey | "feedbackToolbar", key: string): string => {
            if (section === "feedbackToolbar") {
                const dictionary = feedbackToolbarTranslations[
                    locale
                ] as Record<FeedbackToolbarTranslationKey, string>;

                return dictionary[key as FeedbackToolbarTranslationKey] ?? key;
            }

            const dictionary: Record<string, string> =
                translations[locale][section];

            return dictionary[key] ?? key;
        },
        [locale],
    );

    const value = useMemo(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }

    return context;
}
