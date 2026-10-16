import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Metadata } from "next";

import MuiThemeProvider from "@/components/common/providers/MuiThemeProvider";

import { momoTrustSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "QR Feedback",
    description: "Customer feedback system for restaurants",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={momoTrustSans.variable}>
                <AppRouterCacheProvider>
                    <MuiThemeProvider>{children}</MuiThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
