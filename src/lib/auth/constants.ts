export const USER_ROLES = {
    OWNER: "owner",
    MANAGER: "manager",
    STAFF: "staff",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_OPTIONS = [
    {
        value: USER_ROLES.MANAGER,
        label: "Manager",
    },
    {
        value: USER_ROLES.STAFF,
        label: "Staff",
    },
] as const;
