import { redirect } from "next/navigation";

import UsersRolesClient from "@/components/users-roles/UsersRolesClient";
import { USER_ROLES } from "@/lib/auth/constants";
import { getRestaurantMembers, getUserContext } from "@/lib/auth/queries";

export default async function UsersRolesPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        redirect("/login");
    }

    if (userContext.role !== USER_ROLES.OWNER) {
        redirect("/dashboard");
    }

    const members = await getRestaurantMembers(userContext.restaurantId);

    return <UsersRolesClient members={members} />;
}
