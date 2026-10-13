"use client";

import DeleteUserDialog from "@/components/users-roles/DeleteUserDialog";
import { USER_ROLES } from "@/lib/auth/constants";
import type { UserRoleMember } from "@/lib/auth/user-roles.types";
import { buttonBaseSx } from "@/styles/button.styles";
import { tableColumnHeaderSx } from "@/styles/table.styles";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";
import PageHeader from "../common/layout/PageHeader";
import AddUserDialog from "./AddUserDialog";
import ChangeRoleDialog from "./ChangeRoleDialog";

type UsersRolesClientProps = {
    members: UserRoleMember[];
};

type UserRoleCardProps = {
    member: UserRoleMember;
};

const GRID_COLUMNS = "1.5fr 1.5fr 1fr 150px";

function getRoleLabel(role: UserRoleMember["role"]) {
    switch (role) {
        case USER_ROLES.OWNER:
            return "Owner";
        case USER_ROLES.MANAGER:
            return "Manager";
        default:
            return "Staff";
    }
}

function UserRoleCard({ member }: UserRoleCardProps) {
    const isOwner = member.role === USER_ROLES.OWNER;
    const roleLabel = getRoleLabel(member.role);

    return (
        <Box
            sx={{
                p: 2,
                border: "1px solid #EAECF0",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.03)",
            }}
        >
            <Stack sx={{ gap: 1.5 }}>
                {/* User information */}
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                lineHeight: 1.5,
                                color: "#193B56",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {member.fullName || "Chưa cập nhật"}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                lineHeight: 1.5,
                                color: "#667085",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {member.email}
                        </Typography>
                    </Box>

                    <Chip
                        label={roleLabel}
                        size="small"
                        sx={{
                            flexShrink: 0,
                            height: 26,
                            borderRadius: 1.5,
                            bgcolor:
                                member.role === USER_ROLES.OWNER
                                    ? "#EAF3F0"
                                    : member.role === USER_ROLES.MANAGER
                                      ? "#EEF4FF"
                                      : "#F2F4F7",
                            color:
                                member.role === USER_ROLES.OWNER
                                    ? "#237A62"
                                    : member.role === USER_ROLES.MANAGER
                                      ? "#315EA8"
                                      : "#475467",
                            fontSize: 12,
                            fontWeight: 600,
                            "& .MuiChip-label": {
                                px: 1,
                            },
                        }}
                    />
                </Stack>

                {/* User actions */}
                {!isOwner && (
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 1,
                            pt: 1.5,
                            borderTop: "1px solid #EAECF0",
                        }}
                    >
                        <ChangeRoleDialog
                            userId={member.id}
                            fullName={member.fullName}
                            email={member.email}
                            currentRole={member.role}
                        />

                        <DeleteUserDialog
                            userId={member.id}
                            fullName={member.fullName}
                        />
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}

function UsersTable({ members }: UsersRolesClientProps) {
    return (
        <Box
            sx={{
                display: { xs: "none", md: "block" },
                border: "1px solid #EAECF0",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: GRID_COLUMNS,
                    alignItems: "center",
                    minHeight: 52,
                    px: 3,
                    bgcolor: "#F9FAFB",
                    borderBottom: "1px solid #EAECF0",
                }}
            >
                <Typography sx={tableColumnHeaderSx}>Người dùng</Typography>

                <Typography sx={tableColumnHeaderSx}>Email</Typography>

                <Typography sx={tableColumnHeaderSx}>Role</Typography>

                <Typography
                    sx={{
                        ...tableColumnHeaderSx,
                        color: "#667085",
                    }}
                >
                    Thao tác
                </Typography>
            </Box>

            {members.length === 0 ? (
                <EmptyUsersState />
            ) : (
                members.map((member) => (
                    <Box
                        key={member.id}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: GRID_COLUMNS,
                            alignItems: "center",
                            minHeight: 64,
                            px: 3,
                            borderBottom: "1px solid #EAECF0",
                            "&:last-child": {
                                borderBottom: 0,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                minWidth: 0,
                                pr: 2,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1A202E",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {member.fullName || "Chưa cập nhật"}
                        </Typography>

                        <Typography
                            sx={{
                                minWidth: 0,
                                pr: 2,
                                fontSize: 14,
                                color: "#667085",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            title={member.email}
                        >
                            {member.email}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#193B56",
                            }}
                        >
                            {getRoleLabel(member.role)}
                        </Typography>

                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {member.role !== USER_ROLES.OWNER && (
                                <>
                                    <ChangeRoleDialog
                                        userId={member.id}
                                        fullName={member.fullName}
                                        email={member.email}
                                        currentRole={member.role}
                                    />

                                    <DeleteUserDialog
                                        userId={member.id}
                                        fullName={member.fullName}
                                    />
                                </>
                            )}
                        </Stack>
                    </Box>
                ))
            )}
        </Box>
    );
}

function EmptyUsersState() {
    return (
        <Box sx={{ px: 3, py: 5 }}>
            <Typography
                sx={{
                    textAlign: "center",
                    fontSize: 14,
                    color: "#98A2B3",
                }}
            >
                Chưa có người dùng.
            </Typography>
        </Box>
    );
}

export default function UsersRolesClient({ members }: UsersRolesClientProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <>
            <Stack sx={{ gap: 3, width: "100%", minWidth: 0 }}>
                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "stretch",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <PageHeader
                        title="Users & Roles"
                        subtitle="Quản lý người dùng và quyền truy cập của nhà hàng."
                        icon={faUsers}
                    />

                    <Button
                        variant="contained"
                        onClick={() => setIsAddDialogOpen(true)}
                        startIcon={
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{ fontSize: 13 }}
                            />
                        }
                        sx={{
                            ...buttonBaseSx,
                            width: { xs: "100%", sm: "auto" },
                            px: 2,
                            flexShrink: 0,
                        }}
                    >
                        Thêm người dùng
                    </Button>
                </Stack>

                <UsersTable members={members} />

                <Stack
                    sx={{
                        display: { xs: "flex", md: "none" },
                        gap: 1.5,
                        minWidth: 0,
                    }}
                >
                    {members.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                px: 2,
                                border: "1px solid #EAECF0",
                                borderRadius: 2,
                                bgcolor: "#FFFFFF",
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontSize: 14,
                                    color: "#98A2B3",
                                }}
                            >
                                Chưa có người dùng.
                            </Typography>
                        </Box>
                    ) : (
                        members.map((member) => (
                            <UserRoleCard key={member.id} member={member} />
                        ))
                    )}
                </Stack>
            </Stack>

            <AddUserDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
        </>
    );
}
