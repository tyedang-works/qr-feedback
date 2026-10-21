import type { Metadata } from "next";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserContext } from "@/lib/auth/queries";
import { getRestaurantSettings } from "@/lib/restaurant/queries";

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

    return (
        <DashboardLayout
            userContext={userContext}
            feedbackEmail={feedbackEmail}
        >
            {children}
        </DashboardLayout>
    );
}
