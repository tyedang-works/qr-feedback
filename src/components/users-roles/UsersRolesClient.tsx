"use client";

import DeleteUserDialog from "@/components/users-roles/DeleteUserDialog";
import { USER_ROLES } from "@/lib/auth/constants";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import AddUserDialog from "./AddUserDialog";
import ChangeRoleDialog from "./ChangeRoleDialog";
import type { UserRoleMember } from "@/lib/auth/user-roles.types";

type UsersRolesClientProps = {
    members: UserRoleMember[];
};

export default function UsersRolesClient({ members }: UsersRolesClientProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <>
            <Stack
                sx={{
                    gap: 3,
                }}
            >
                {/* Header */}
                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 22,
                                    sm: 24,
                                },
                                fontWeight: 700,
                                color: "#193B56",
                            }}
                        >
                            Users & Roles
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 14,
                                color: "#667085",
                            }}
                        >
                            Quản lý người dùng và quyền truy cập của nhà hàng.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<FontAwesomeIcon icon={faPlus} size="sm" />}
                        onClick={() => setIsAddDialogOpen(true)}
                        sx={{
                            minWidth: 100,
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "none",
                        }}
                    >
                        Thêm
                    </Button>
                </Stack>

                {/* User list */}
                <Box
                    sx={{
                        border: "1px solid #eaecf0",
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1.5fr 1fr 150px",
                            alignItems: "center",
                            minHeight: 52,
                            px: 3,
                            backgroundColor: "#f9fafb",
                            borderBottom: "1px solid #eaecf0",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            Người dùng
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            Email
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            Role
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#667085",
                            }}
                        >
                            Thao tác
                        </Typography>
                    </Box>

                    {members.length === 0 ? (
                        <Box
                            sx={{
                                px: 3,
                                py: 5,
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontSize: 14,
                                    color: "#98a2b3",
                                }}
                            >
                                Chưa có người dùng.
                            </Typography>
                        </Box>
                    ) : (
                        members.map((member) => (
                            <Box
                                key={member.id}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1.5fr 1.5fr 1fr 150px",
                                    alignItems: "center",
                                    minHeight: 64,
                                    px: 3,
                                    borderBottom: "1px solid #eaecf0",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "#1A202E",
                                    }}
                                >
                                    {member.fullName || "Chưa cập nhật"}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        color: "#667085",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        pr: 2,
                                    }}
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
                                    {member.role === "owner"
                                        ? "Owner"
                                        : member.role === "manager"
                                          ? "Manager"
                                          : "Staff"}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
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
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>
            </Stack>

            <AddUserDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
        </>
    );
}
