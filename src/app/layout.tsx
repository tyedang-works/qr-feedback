import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";

import MuiThemeProvider from "@/components/common/providers/MuiThemeProvider";
import LanguageProvider from "@/components/common/providers/LanguageProvider";
import type { Locale } from "@/i18n/translations";

import { momoTrustSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "QR Feedback",
    description: "Customer feedback system for restaurants",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

const themeInitScript = `
(function () {
    try {
        var savedTheme = localStorage.getItem("qr-feedback-theme");
        document.documentElement.dataset.theme =
            savedTheme === "dark" ? "dark" : "light";
    } catch (_) {
        document.documentElement.dataset.theme = "light";
    }
})();
`;

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get("qr-locale")?.value;

    const locale: Locale = savedLocale === "en" ? "en" : "vi";

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={momoTrustSans.variable}>
                <Script
                    id="qr-feedback-theme-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: themeInitScript,
                    }}
                />

                <AppRouterCacheProvider>
                    <MuiThemeProvider>
                        <LanguageProvider initialLocale={locale}>
                            {children}
                        </LanguageProvider>
                    </MuiThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
