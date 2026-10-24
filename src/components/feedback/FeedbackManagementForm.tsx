"use client";

import { updateFeedback } from "@/app/dashboard/feedback/[id]/actions";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { FEEDBACK_STATUS, type FeedbackStatus } from "@/lib/feedback/constants";
import { FEEDBACK_STATUS_CONFIG } from "@/lib/feedback/status";
import { buttonBaseSx } from "@/styles/button.styles";
import { Box, Button, MenuItem, Stack } from "@mui/material";
import type { FormikHelpers } from "formik";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as Yup from "yup";

type FeedbackManagementFormProps = {
    feedbackPublicId: string;
    initialStatus: FeedbackStatus;
    initialInternalNote: string | null;
};

type FeedbackManagementFormValues = {
    status: FeedbackStatus;
    internalNote: string;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

const FEEDBACK_STATUS_OPTIONS = Object.values(FEEDBACK_STATUS).map((value) => ({
    value,
    label: FEEDBACK_STATUS_CONFIG[value].label,
}));

const validationSchema = Yup.object({
    status: Yup.mixed<FeedbackStatus>()
        .oneOf(Object.values(FEEDBACK_STATUS), "Trạng thái không hợp lệ.")
        .required(" "),
    internalNote: Yup.string()
        .defined(" ")
        .trim()
        .max(1000, "Ghi chú nội bộ không được vượt quá 1000 ký tự."),
});

export default function FeedbackManagementForm({
    feedbackPublicId,
    initialStatus,
    initialInternalNote,
}: FeedbackManagementFormProps) {
    const router = useRouter();

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const initialValues: FeedbackManagementFormValues = {
        status: initialStatus,
        internalNote: initialInternalNote ?? "",
    };

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleSubmit = useCallback(
        async (
            values: FeedbackManagementFormValues,
            { setSubmitting }: FormikHelpers<FeedbackManagementFormValues>,
        ) => {
            try {
                const result = await updateFeedback({
                    feedbackPublicId,
                    status: values.status,
                    internalNote: values.internalNote,
                });

                setSnackbar({
                    open: true,
                    message: result.message,
                    severity: result.success ? "success" : "error",
                });

                if (result.success) {
                    router.refresh();
                }
            } catch {
                setSnackbar({
                    open: true,
                    message: "Đã xảy ra lỗi khi cập nhật phản hồi.",
                    severity: "error",
                });
            } finally {
                setSubmitting(false);
            }
        },
        [feedbackPublicId, router],
    );

    return (
        <>
            <Formik<FeedbackManagementFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    isSubmitting,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                }) => (
                    <Form noValidate>
                        <Stack sx={{ gap: 2 }}>
                            <QRSelect
                                name="status"
                                value={values.status}
                                label="Trạng thái"
                                required
                                onChange={(event) => {
                                    void setFieldValue(
                                        "status",
                                        event.target.value,
                                    );
                                }}
                                onBlur={handleBlur}
                                errorMessage={
                                    touched.status && errors.status
                                        ? errors.status
                                        : undefined
                                }
                            >
                                {FEEDBACK_STATUS_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </QRSelect>

                            <QRTextField
                                name="internalNote"
                                required
                                label="Ghi chú nội bộ"
                                placeholder="Nhập ghi chú xử lý..."
                                multiline
                                minRows={3}
                                maxRows={6}
                                value={values.internalNote}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errorMessage={
                                    touched.internalNote && errors.internalNote
                                        ? errors.internalNote
                                        : undefined
                                }
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    pt: 0.5,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{
                                        ...buttonBaseSx,
                                        minWidth: 130,
                                        width: "auto",
                                        px: 2.5,
                                        minHeight: 40,
                                    }}
                                >
                                    {isSubmitting
                                        ? "Đang lưu..."
                                        : "Lưu thay đổi"}
                                </Button>
                            </Box>
                        </Stack>
                    </Form>
                )}
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
