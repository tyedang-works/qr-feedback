"use client";

import { deleteUserAction } from "@/app/dashboard/users-roles/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteUserDialogProps = {
    userId: string;
    fullName: string | null;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

export default function DeleteUserDialog({
    userId,
    fullName,
}: DeleteUserDialogProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleClose = () => {
        if (isDeleting) {
            return;
        }

        setOpen(false);
    };

    const handleDelete = async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteUserAction(userId);

            if (!result.success) {
                setSnackbar({
                    open: true,
                    message: result.message || "Không thể xóa người dùng.",
                    severity: "error",
                });

                return;
            }

            setOpen(false);

            setSnackbar({
                open: true,
                message: result.message || "Đã xóa người dùng thành công.",
                severity: "success",
            });

            router.refresh();
        } catch (error) {
            console.error("Failed to delete user:", error);

            setSnackbar({
                open: true,
                message: "Đã xảy ra lỗi. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                disabled={isDeleting}
                sx={{
                    minWidth: 52,
                    height: 34,
                    px: 1.25,
                    borderRadius: 1.5,
                    color: "#d92d20",
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "#fef3f2",
                    },
                }}
            >
                Xóa
            </Button>

            <QRDialog
                open={open}
                onClose={handleClose}
                title="Xóa người dùng"
                actions={
                    <>
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={isDeleting}
                            sx={{
                                minWidth: 72,
                                height: 40,
                                px: 2,
                                borderRadius: 1.5,
                                color: "#667085",
                                fontSize: 14,
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#f8fafc",
                                },
                            }}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            sx={{
                                minWidth: 88,
                                height: 40,
                                px: 2,
                                borderRadius: 1.5,
                                backgroundColor: "#d92d20",
                                fontSize: 14,
                                fontWeight: 600,
                                textTransform: "none",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#b42318",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            {isDeleting ? (
                                <>
                                    <CircularProgress
                                        size={16}
                                        thickness={5}
                                        sx={{
                                            color: "inherit",
                                            mr: 1,
                                        }}
                                    />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa"
                            )}
                        </Button>
                    </>
                }
            >
                <Typography
                    sx={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#344054",
                    }}
                >
                    Bạn có chắc muốn xóa người dùng{" "}
                    <Typography
                        component="span"
                        sx={{
                            fontSize: "inherit",
                            fontWeight: 600,
                            color: "#1A202E",
                        }}
                    >
                        {fullName || "này"}
                    </Typography>
                    ?
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "#667085",
                    }}
                >
                    Tài khoản và quyền truy cập của người dùng này sẽ bị xóa.
                    Email có thể được sử dụng lại cho người dùng khác.
                </Typography>
            </QRDialog>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />
        </>
    );
}
