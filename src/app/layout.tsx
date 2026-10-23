import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";

import MuiThemeProvider from "@/components/common/providers/MuiThemeProvider";

import { momoTrustSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "QR Feedback",
    description: "Customer feedback system for restaurants",
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={momoTrustSans.variable}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: themeInitScript,
                    }}
                />

                <AppRouterCacheProvider>
                    <MuiThemeProvider>{children}</MuiThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
