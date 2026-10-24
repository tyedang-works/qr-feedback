import { getUserContext } from "@/lib/auth/queries";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const userContext = await getUserContext();

    if (userContext) {
        redirect("/dashboard");
    }

    redirect("/login");
}
