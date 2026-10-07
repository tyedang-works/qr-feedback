"use client";

import { changeUserRoleAction } from "@/app/dashboard/users-roles/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRSelect from "@/components/common/input/QRSelect";
import { USER_ROLE_OPTIONS, type UserRole } from "@/lib/auth/constants";
import {
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";

type ChangeRoleFormValues = {
    role: UserRole;
};

type ChangeRoleDialogProps = {
    userId: string;
    fullName: string | null;
    email: string;
    currentRole: UserRole;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

const validationSchema = yup.object({
    role: yup
        .mixed<UserRole>()
        .oneOf(
            USER_ROLE_OPTIONS.map((option) => option.value),
            "Vai trò không hợp lệ.",
        )
        .required("Vui lòng chọn vai trò."),
});

export default function ChangeRoleDialog({
    userId,
    fullName,
    email,
    currentRole,
}: ChangeRoleDialogProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const initialValues: ChangeRoleFormValues = {
        role: currentRole,
    };

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleSubmit = async (
        values: ChangeRoleFormValues,
        { setSubmitting, resetForm }: FormikHelpers<ChangeRoleFormValues>,
    ) => {
        try {
            const formData = new FormData();

            formData.append("userId", userId);
            formData.append("role", values.role);

            const result = await changeUserRoleAction(
                {
                    success: false,
                    message: "",
                },
                formData,
            );

            if (!result.success) {
                setSnackbar({
                    open: true,
                    message: result.message,
                    severity: "error",
                });

                return;
            }

            setSnackbar({
                open: true,
                message: result.message,
                severity: "success",
            });

            resetForm({
                values,
            });

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to change user role:", error);

            setSnackbar({
                open: true,
                message: "Không thể cập nhật vai trò. Vui lòng thử lại.",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                sx={{
                    minWidth: 0,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 1.5,
                    color: "#193B56",
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "#eef4f8",
                    },
                }}
            >
                Đổi role
            </Button>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount={false}
                validateOnChange={false}
                validateOnBlur
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    resetForm,
                }) => {
                    const hasRoleChanged = values.role !== currentRole;

                    const handleClose = () => {
                        if (isSubmitting) {
                            return;
                        }

                        resetForm();
                        setOpen(false);
                    };

                    return (
                        <QRDialog
                            open={open}
                            onClose={handleClose}
                            title="Đổi vai trò"
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        sx={{
                                            minWidth: 80,
                                            height: 40,
                                            borderRadius: 1.5,
                                            color: "#667085",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            textTransform: "none",
                                        }}
                                    >
                                        Hủy
                                    </Button>

                                    <Button
                                        type="submit"
                                        form="change-user-role-form"
                                        variant="contained"
                                        disabled={
                                            isSubmitting || !hasRoleChanged
                                        }
                                        sx={{
                                            minWidth: 130,
                                            height: 40,
                                            borderRadius: 1.5,
                                            backgroundColor: "#193B56",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            boxShadow: "none",
                                            "&:hover": {
                                                backgroundColor: "#142f45",
                                                boxShadow: "none",
                                            },
                                            "&.Mui-disabled": {
                                                backgroundColor: "#e4e7ec",
                                                color: "#98a2b3",
                                            },
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress
                                                size={18}
                                                sx={{
                                                    color: "#ffffff",
                                                }}
                                            />
                                        ) : (
                                            "Lưu thay đổi"
                                        )}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="change-user-role-form">
                                <Stack sx={{ gap: 1.75, mb: 2.5 }}>
                                    <Typography
                                        sx={{
                                            mb: 0.5,
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            fontWeight: 400,
                                            color: "#1a202e",
                                        }}
                                    >
                                        Tên:&nbsp;
                                        <span style={{ fontWeight: 600 }}>
                                            {fullName || "Chưa cập nhật"}
                                        </span>
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mb: 0.5,
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            fontWeight: 400,
                                            color: "#1a202e",
                                        }}
                                    >
                                        Email:&nbsp;
                                        <span style={{ fontWeight: 600 }}>
                                            {email || "Chưa cập nhật"}
                                        </span>
                                    </Typography>
                                </Stack>

                                <QRSelect
                                    name="role"
                                    label="Vai trò"
                                    value={values.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errorMessage={
                                        touched.role ? errors.role : undefined
                                    }
                                >
                                    {USER_ROLE_OPTIONS.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </QRSelect>
                            </Form>
                        </QRDialog>
                    );
                }}
            </Formik>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />
        </>
    );
}
