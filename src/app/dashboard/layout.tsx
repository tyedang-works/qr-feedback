import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getUserContext } from "@/lib/auth/queries";

type DashboardRouteLayoutProps = {
    children: React.ReactNode;
};

export default async function DashboardRouteLayout({
    children,
}: DashboardRouteLayoutProps) {
    const userContext = await getUserContext();

    return (
        <DashboardLayout userContext={userContext}>{children}</DashboardLayout>
    );
}
