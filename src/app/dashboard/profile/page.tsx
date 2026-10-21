import { redirect } from "next/navigation";

import ProfilePage from "@/components/profile/ProfilePage";
import { getProfileAction } from "./actions";

export default async function DashboardProfileRoute() {
    const result = await getProfileAction();

    if (!result.success || !result.profile) {
        redirect("/login");
    }

    return <ProfilePage profile={result.profile} />;
}
