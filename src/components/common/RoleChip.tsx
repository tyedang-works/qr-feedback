import { Chip } from "@mui/material";

import { USER_ROLES } from "@/lib/auth/constants";
import type { UserRoleMember } from "@/lib/auth/user-roles.types";

type RoleChipProps = {
    role: UserRoleMember["role"];
};

const ROLE_CONFIG = {
    [USER_ROLES.OWNER]: {
        label: "Owner",
        color: "#237A62",
        bgcolor: "#EAF3F0",
    },
    [USER_ROLES.MANAGER]: {
        label: "Manager",
        color: "#315EA8",
        bgcolor: "#EEF4FF",
    },
    [USER_ROLES.STAFF]: {
        label: "Staff",
        color: "#475467",
        bgcolor: "#F2F4F7",
    },
} as const;

export default function RoleChip({ role }: RoleChipProps) {
    const config = ROLE_CONFIG[role];

    return (
        <Chip
            label={config.label}
            size="small"
            sx={{
                flexShrink: 0,
                height: 26,
                borderRadius: 1.5,
                bgcolor: config.bgcolor,
                color: config.color,
                fontSize: 12,
                fontWeight: 600,
                width: "fit-content",
                "& .MuiChip-label": {
                    px: 1,
                },
            }}
        />
    );
}
