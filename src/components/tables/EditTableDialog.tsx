"use client";

import { Button, CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";

import { updateTableAction } from "@/app/dashboard/tables/actions";
import { useTranslation } from "@/components/common/providers/useTranslation";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";
import {
    buttonBaseCancelSx,
    buttonBaseSx,
    tableEditButtonSx,
} from "@/styles/button.styles";
import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

type EditTableFormValues = {
    name: string;
};

type EditTableDialogProps = {
    tableId: string;
    tableName: string;
    tableNames: string[];
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

function createValidationSchema(
    tableName: string,
    tableNames: string[],
    t: (section: "table", key: string) => string,
) {
    const normalizedCurrentName = tableName.trim().toLowerCase();

    const normalizedTableNames = tableNames
        .map((name) => name.trim().toLowerCase())
        .filter((name) => name !== normalizedCurrentName);

    return yup.object({
        name: yup
            .string()
            .trim()
            .required(" ")
            .test(
                "unique-table-name",
                t("table", "duplicateTableName"),
                (value) => {
                    if (!value) {
                        return true;
                    }

                    const normalizedName = value.trim().toLowerCase();

                    return !normalizedTableNames.includes(normalizedName);
                },
            ),
    });
}

export default function EditTableDialog({
    tableId,
    tableName,
    tableNames,
}: EditTableDialogProps) {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const initialValues: EditTableFormValues = {
        name: tableName,
    };

    const validationSchema = useMemo(
        () => createValidationSchema(tableName, tableNames, t),
        [tableName, tableNames, t],
    );

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    const handleSubmit = async (
        values: EditTableFormValues,
        {
            setSubmitting,
            setFieldError,
            resetForm,
        }: FormikHelpers<EditTableFormValues>,
    ) => {
        try {
            const formData = new FormData();

            formData.append("tableId", tableId);
            formData.append("name", values.name.trim());

            const result = await updateTableAction(
                {
                    success: false,
                    message: "",
                    fieldErrors: {},
                },
                formData,
            );

            if (!result.success) {
                if (result.fieldErrors?.name) {
                    setFieldError(
                        "name",
                        result.fieldErrors.name === "duplicateTableName"
                            ? t("table", "duplicateTableName")
                            : result.fieldErrors.name,
                    );

                    return;
                }

                setSnackbar({
                    open: true,
                    message: result.message || t("table", "updateTableFailed"),
                    severity: "error",
                });

                return;
            }

            resetForm();
            setOpen(false);

            setSnackbar({
                open: true,
                message: t("table", "updateTableSuccess"),
                severity: "success",
            });
        } catch (error) {
            console.error("Failed to update table:", error);

            setSnackbar({
                open: true,
                message: t("table", "updateTableError"),
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
                sx={tableEditButtonSx}
            >
                {t("table", "editTable")}
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
                    setFieldError,
                    resetForm,
                }) => {
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
                            title={t("table", "editTableTitle")}
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        sx={buttonBaseCancelSx}
                                    >
                                        {t("table", "cancel")}
                                    </Button>

                                    <Button
                                        type="submit"
                                        form="edit-table-form"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={buttonBaseSx}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <CircularProgress
                                                    size={16}
                                                    thickness={5}
                                                    sx={{
                                                        color: "inherit",
                                                        mr: 1,
                                                    }}
                                                />
                                                {t("table", "saving")}
                                            </>
                                        ) : (
                                            t("table", "saveChanges")
                                        )}
                                    </Button>
                                </>
                            }
                        >
                            <Form id="edit-table-form" noValidate>
                                <QRTextField
                                    name="name"
                                    label={t("table", "tableName")}
                                    placeholder={t(
                                        "table",
                                        "tableNamePlaceholder",
                                    )}
                                    required
                                    value={values.name}
                                    onChange={(event) => {
                                        handleChange(event);

                                        if (errors.name) {
                                            setFieldError("name", undefined);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    errorMessage={
                                        touched.name ? errors.name : undefined
                                    }
                                />
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
