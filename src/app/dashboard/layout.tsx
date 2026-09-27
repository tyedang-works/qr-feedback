import DashboardLayout from "@/components/dashboard/DashboardLayout";

type DashboardRouteLayoutProps = {
    children: React.ReactNode;
};

export default function DashboardRouteLayout({
    children,
}: DashboardRouteLayoutProps) {
    return <DashboardLayout>{children}</DashboardLayout>;
}