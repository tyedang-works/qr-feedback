import { USER_ROLES, UserRole } from "./constants";

export function isOwner(role: UserRole) {
    return role === USER_ROLES.OWNER;
}

export function isManager(role: UserRole) {
    return role === USER_ROLES.MANAGER;
}

export function isStaff(role: UserRole) {
    return role === USER_ROLES.STAFF;
}
