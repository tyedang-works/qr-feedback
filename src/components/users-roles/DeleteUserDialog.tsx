"use client";

import { deleteUserAction } from "@/app/dashboard/users-roles/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import { useTranslation } from "@/components/common/providers/useTranslation";
import {
    buttonBaseCancelSx,
    buttonBaseSx,
    tableDeleteButtonSx,
} from "@/styles/button.styles";
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
    const { t } = useTranslation();

    const deleteT = (key: string) => t("usersRoles", `deleteUser.${key}`);

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
                    message: result.message || deleteT("deleteError"),
                    severity: "error",
                });

                return;
            }

            setOpen(false);

            setSnackbar({
                open: true,
                message: result.message || deleteT("deleteSuccess"),
                severity: "success",
            });

            router.refresh();
        } catch (error) {
            console.error("Failed to delete user:", error);

            setSnackbar({
                open: true,
                message: deleteT("generalError"),
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
                sx={tableDeleteButtonSx}
            >
                {deleteT("delete")}
            </Button>

            <QRDialog
                open={open}
                onClose={handleClose}
                title={deleteT("title")}
                actions={
                    <>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleClose}
                            disabled={isDeleting}
                            sx={buttonBaseCancelSx}
                        >
                            {deleteT("cancel")}
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            sx={{
                                ...buttonBaseSx,
                                backgroundColor: "#d92d20",
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
                                    {deleteT("deleting")}
                                </>
                            ) : (
                                deleteT("delete")
                            )}
                        </Button>
                    </>
                }
            >
                <Typography
                    sx={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--color-text-primary)",
                    }}
                >
                    {deleteT("confirmPrefix")}{" "}
                    <Typography
                        component="span"
                        sx={{
                            fontSize: "inherit",
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {fullName || deleteT("thisUser")}
                    </Typography>
                    {deleteT("confirmSuffix")}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {deleteT("description")}
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
