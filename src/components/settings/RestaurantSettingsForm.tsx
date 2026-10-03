"use client";

import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Box, Button, CircularProgress, Stack } from "@mui/material";

import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";

import { updateRestaurantSettings } from "@/app/dashboard/settings/actions";
import type { RestaurantSettings } from "@/lib/restaurant/types";

type RestaurantSettingsFormProps = {
    initialSettings: RestaurantSettings;
};

const PHONE_REGEX = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validationSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập tên nhà hàng.")
        .max(100, "Tên nhà hàng không được vượt quá 100 ký tự."),

    phone: Yup.string()
        .trim()
        .max(30, "Số điện thoại không được vượt quá 30 ký tự.")
        .test(
            "valid-phone",
            "Số điện thoại không hợp lệ. Ví dụ: 0912345678.",
            (value) => !value || PHONE_REGEX.test(value),
        ),

    email: Yup.string()
        .trim()
        .max(254, "Email không được vượt quá 254 ký tự.")
        .test(
            "valid-email",
            "Email không hợp lệ.",
            (value) => !value || EMAIL_REGEX.test(value),
        ),

    address: Yup.string()
        .trim()
        .max(500, "Địa chỉ không được vượt quá 500 ký tự."),
});

export default function RestaurantSettingsForm({
    initialSettings,
}: RestaurantSettingsFormProps) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    return (
        <>
            <Formik
                initialValues={{
                    name: initialSettings.name ?? "",
                    phone: initialSettings.phone ?? "",
                    email: initialSettings.email ?? "",
                    address: initialSettings.address ?? "",
                }}
                validationSchema={validationSchema}
                validateOnChange
                validateOnBlur
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const result = await updateRestaurantSettings({
                            name: values.name.trim(),
                            phone: values.phone.trim(),
                            email: values.email.trim(),
                            address: values.address.trim(),
                        });

                        setSnackbar({
                            open: true,
                            message: result.message,
                            severity: result.success ? "success" : "error",
                        });
                    } catch (error) {
                        console.error(
                            "Failed to save restaurant settings:",
                            error,
                        );

                        setSnackbar({
                            open: true,
                            message:
                                "Đã xảy ra lỗi khi lưu thông tin nhà hàng.",
                            severity: "error",
                        });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => {
                    const getErrorMessage = (
                        field: keyof typeof values,
                    ): string => {
                        const error = errors[field];

                        return touched[field] && typeof error === "string"
                            ? error
                            : "";
                    };

                    return (
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ width: "100%" }}
                        >
                            <Stack sx={{ gap: 3 }}>
                                <QRTextField
                                    name="name"
                                    label="Tên nhà hàng"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errorMessage={getErrorMessage("name")}
                                    required
                                    placeholder="Nhập tên nhà hàng"
                                    disabled={isSubmitting}
                                />

                                <QRTextField
                                    name="phone"
                                    label="Số điện thoại"
                                    type="tel"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errorMessage={getErrorMessage("phone")}
                                    placeholder="Ví dụ: 0912345678"
                                    autoComplete="tel"
                                    disabled={isSubmitting}
                                />

                                <QRTextField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errorMessage={getErrorMessage("email")}
                                    placeholder="Nhập email liên hệ"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                />

                                <QRTextField
                                    name="address"
                                    label="Địa chỉ"
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errorMessage={getErrorMessage("address")}
                                    placeholder="Nhập địa chỉ nhà hàng"
                                    autoComplete="street-address"
                                    disabled={isSubmitting}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={{
                                            minWidth: 140,
                                            height: 40,
                                        }}
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
                                                Đang lưu...
                                            </>
                                        ) : (
                                            "Lưu thay đổi"
                                        )}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    );
                }}
            </Formik>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => {
                    setSnackbar((current) => ({
                        ...current,
                        open: false,
                    }));
                }}
            />
        </>
    );
}
