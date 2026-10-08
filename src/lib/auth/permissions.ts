import { USER_ROLES, type UserRole } from "./constants";

export function isOwner(role: UserRole) {
    return role === USER_ROLES.OWNER;
}

export function isManager(role: UserRole) {
    return role === USER_ROLES.MANAGER;
}

export function isStaff(role: UserRole) {
    return role === USER_ROLES.STAFF;
}

export function canManageTables(role: UserRole) {
    return isOwner(role) || isManager(role);
}

export function canAccessFeedbackPage(role: UserRole) {
    return isOwner(role) || isStaff(role);
}

export function canManageSettings(role: UserRole) {
    return isOwner(role);
}

export function canManageUsers(role: UserRole) {
    return isOwner(role);
}

export function canViewQRCodes(role: UserRole) {
    return isOwner(role) || isManager(role) || isStaff(role);
}
