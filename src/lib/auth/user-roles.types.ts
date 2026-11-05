import type { UserRole } from "./constants";

export type UserRoleMember = {
    id: string;
    fullName: string | null;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
};
