import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import "./globals.css";
import MuiThemeProvider from "@/components/common/providers/MuiThemeProvider";

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
            <body>
                <AppRouterCacheProvider>
                    <MuiThemeProvider>{children}</MuiThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
