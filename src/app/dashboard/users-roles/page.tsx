import { redirect } from "next/navigation";
import UsersRolesClient from "@/components/users-roles/UsersRolesClient";
import { canManageUsers } from "@/lib/auth/permissions";
import { getRestaurantMembers, getUserContext } from "@/lib/auth/queries";

export default async function UsersRolesPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        redirect("/login");
    }

    if (!canManageUsers(userContext.role)) {
        redirect("/dashboard");
    }

    const members = await getRestaurantMembers(userContext.restaurantId);

    return <UsersRolesClient members={members} />;
}
