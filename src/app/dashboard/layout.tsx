import type { Metadata } from "next";

import SessionRefreshReminder from "@/components/auth/SessionRefreshReminder";
import LanguageProvider from "@/components/common/providers/LanguageProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DashboardLoadingProvider } from "@/components/dashboard/DashboardLoadingProvider";
import { Locale } from "@/i18n/translations";
import { getUserContext } from "@/lib/auth/queries";
import { getRestaurantSettings } from "@/lib/restaurant/queries";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const defaultMetadata: Metadata = {
        title: "QR Feedback",
        description: "Customer feedback system for restaurants",
        icons: {
            icon: "/assets/favicon.ico",
        },
    };

    try {
        const userContext = await getUserContext();

        if (!userContext) {
            return defaultMetadata;
        }

        const restaurant = await getRestaurantSettings(
            userContext.restaurantId,
        );

        return {
            ...defaultMetadata,
            icons: {
                icon: restaurant?.favicon_url || "/assets/favicon.ico",
            },
        };
    } catch (error) {
        console.error("Failed to load restaurant favicon:", error);
        return defaultMetadata;
    }
}

type DashboardRouteLayoutProps = {
    children: React.ReactNode;
};

export default async function DashboardRouteLayout({
    children,
}: DashboardRouteLayoutProps) {
    const userContext = await getUserContext();
    const feedbackEmail = process.env.FEEDBACK_EMAIL ?? "";

    const cookieStore = await cookies();
    const savedLocale = cookieStore.get("qr-locale")?.value;

    const locale: Locale = savedLocale === "en" ? "en" : "vi";

    return (
        <DashboardLoadingProvider>
            <LanguageProvider initialLocale={locale}>
                <DashboardLayout
                    userContext={userContext}
                    feedbackEmail={feedbackEmail}
                >
                    {children}
                    <SessionRefreshReminder />
                </DashboardLayout>
            </LanguageProvider>
        </DashboardLoadingProvider>
    );
}
