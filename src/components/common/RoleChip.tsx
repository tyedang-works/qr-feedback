"use client";

import { Chip } from "@mui/material";

import { UserRole } from "@/lib/auth/constants";
import type { UserRoleMember } from "@/lib/auth/user-roles.types";

type RoleChipProps = {
    role: UserRoleMember["role"];
};

const ROLE_LABELS: Record<UserRole, string> = {
    owner: "Chủ nhà hàng",
    manager: "Quản lý",
    staff: "Nhân viên",
};

export default function RoleChip({ role }: RoleChipProps) {
    return (
        <Chip
            label={ROLE_LABELS[role]}
            size="small"
            sx={{
                display: "inline-flex",
                flexShrink: 0,
                width: "fit-content",
                height: 26,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: `var(--color-role-${role}-border)`,
                bgcolor: `var(--color-role-${role}-bg)`,
                color: `var(--color-role-${role}-text)`,
                fontSize: 11.5,
                fontWeight: 650,
                letterSpacing: "0.1px",
                lineHeight: 1.4,
                transition:
                    "background-color 150ms ease, color 150ms ease, border-color 150ms ease",
                "& .MuiChip-label": {
                    display: "block",
                    px: 1,
                    py: "3px",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                },
            }}
        />
    );
}
