import type { UserRole } from "./constants";

export type UserRoleOption = {
    value: Exclude<UserRole, "owner">;
    label: string;
};

export type UserRoleMember = {
    id: string;
    fullName: string | null;
    email: string;
    role: UserRole;
};
