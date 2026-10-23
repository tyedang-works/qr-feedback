"use client";

import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { UserRoundCog } from "lucide-react";
import { useState } from "react";

import PageHeader from "@/components/common/layout/PageHeader";
import AddUserDialog from "@/components/users-roles/AddUserDialog";
import DeleteUserDialog from "@/components/users-roles/DeleteUserDialog";
import EditUserDialog from "@/components/users-roles/EditUserDialog";
import { USER_ROLES } from "@/lib/auth/constants";
import type { UserRoleMember } from "@/lib/auth/user-roles.types";
import { buttonBaseSx, tableEditButtonSx } from "@/styles/button.styles";
import { tableColumnHeaderSx } from "@/styles/table.styles";
import RoleChip from "../common/RoleChip";

type UsersRolesClientProps = {
    members: UserRoleMember[];
};

type UserRoleItemProps = {
    member: UserRoleMember;
    onEdit: (member: UserRoleMember) => void;
};

const GRID_COLUMNS = "1.5fr 1.5fr 1fr 160px";

function UserRoleCard({ member, onEdit }: UserRoleItemProps) {
    const isOwner = member.role === USER_ROLES.OWNER;

    return (
        <Box
            sx={{
                p: 2,
                border: "1px solid var(--color-border)",
                borderRadius: 2,
                bgcolor: "var(--color-surface)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack sx={{ gap: 1.5 }}>
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
                                color: "var(--color-text-primary)",
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
                                color: "var(--color-text-secondary)",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {member.email}
                        </Typography>
                    </Box>

                    {member?.role && <RoleChip role={member.role} />}
                </Stack>

                {!isOwner && (
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 1,
                            pt: 1.5,
                            borderTop: "1px solid var(--color-border)",
                        }}
                    >
                        <Button
                            onClick={() => onEdit(member)}
                            sx={tableEditButtonSx}
                        >
                            Chỉnh sửa
                        </Button>

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

function UsersTable({
    members,
    onEdit,
}: UsersRolesClientProps & {
    onEdit: (member: UserRoleMember) => void;
}) {
    return (
        <Box
            sx={{
                display: { xs: "none", md: "block" },
                border: "1px solid var(--color-border)",
                borderRadius: 2,
                bgcolor: "var(--color-surface)",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: GRID_COLUMNS,
                    alignItems: "center",
                    minHeight: 56,
                    px: 3,
                    bgcolor: "var(--color-table-header-bg)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <Typography sx={tableColumnHeaderSx}>Người dùng</Typography>
                <Typography sx={tableColumnHeaderSx}>Email</Typography>
                <Typography sx={tableColumnHeaderSx}>Role</Typography>
                <Typography sx={tableColumnHeaderSx}>Thao tác</Typography>
            </Box>

            {members.length === 0 ? (
                <EmptyUsersState />
            ) : (
                members.map((member) => {
                    const isOwner = member.role === USER_ROLES.OWNER;

                    return (
                        <Box
                            key={member.id}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: GRID_COLUMNS,
                                alignItems: "center",
                                minHeight: 64,
                                px: 3,
                                borderBottom: "1px solid var(--color-border)",
                                "&:last-child": {
                                    borderBottom: 0,
                                },
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 1.5,
                                    minWidth: 0,
                                    pr: 2,
                                }}
                            >
                                <Avatar
                                    src={member.avatarUrl || undefined}
                                    alt={member.fullName || "Người dùng"}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        bgcolor: "var(--color-surface-active)",
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {(member.fullName || member.email || "?")
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase()}
                                </Avatar>

                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "var(--color-text-primary)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                    title={member.fullName || "Chưa cập nhật"}
                                >
                                    {member.fullName || "Chưa cập nhật"}
                                </Typography>
                            </Stack>

                            <Typography
                                sx={{
                                    minWidth: 0,
                                    pr: 2,
                                    fontSize: 14,
                                    color: "var(--color-text-secondary)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                title={member.email}
                            >
                                {member.email}
                            </Typography>

                            {member?.role && <RoleChip role={member.role} />}

                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 1.5,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {!isOwner && (
                                    <>
                                        <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => onEdit(member)}
                                            sx={tableEditButtonSx}
                                        >
                                            Chỉnh sửa
                                        </Button>

                                        <DeleteUserDialog
                                            userId={member.id}
                                            fullName={member.fullName}
                                        />
                                    </>
                                )}
                            </Stack>
                        </Box>
                    );
                })
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
                    color: "var(--color-text-muted)",
                }}
            >
                Chưa có người dùng.
            </Typography>
        </Box>
    );
}

export default function UsersRolesClient({ members }: UsersRolesClientProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRoleMember | null>(
        null,
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEditUser = (member: UserRoleMember) => {
        setSelectedUser(member);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditUser = () => {
        setIsEditDialogOpen(false);
    };

    const currentSelectedUser =
        members.find((member) => member.id === selectedUser?.id) ?? null;

    const handleUserUpdated = (avatarUrl: string | null) => {
        setSelectedUser((current) =>
            current
                ? {
                      ...current,
                      avatarUrl,
                  }
                : current,
        );
    };

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
                        icon={UserRoundCog}
                    />

                    <Button
                        variant="contained"
                        onClick={() => setIsAddDialogOpen(true)}
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

                <UsersTable members={members} onEdit={handleEditUser} />

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
                                border: "1px solid var(--color-border)",
                                borderRadius: 2,
                                bgcolor: "var(--color-surface)",
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontSize: 14,
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                Chưa có người dùng.
                            </Typography>
                        </Box>
                    ) : (
                        members.map((member) => (
                            <UserRoleCard
                                key={member.id}
                                member={member}
                                onEdit={handleEditUser}
                            />
                        ))
                    )}
                </Stack>
            </Stack>

            <AddUserDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />

            {currentSelectedUser && (
                <EditUserDialog
                    open={isEditDialogOpen}
                    user={{
                        id: currentSelectedUser.id,
                        full_name: currentSelectedUser.fullName ?? "",
                        email: currentSelectedUser.email,
                        role: currentSelectedUser.role,
                        avatar_url: currentSelectedUser.avatarUrl,
                    }}
                    onClose={handleCloseEditUser}
                    onUserUpdated={handleUserUpdated}
                />
            )}
        </>
    );
}
