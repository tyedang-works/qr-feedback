"use client";

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { Formik } from "formik";
import { Store } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import * as Yup from "yup";

import { updateRestaurantSettings } from "@/app/dashboard/settings/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";
import { VIETNAM_PHONE_REGEX } from "@/constants/validation.constants";
import type { RestaurantSettings } from "@/lib/restaurant/types";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";

type RestaurantSettingsFormProps = {
    initialSettings: RestaurantSettings;
};

type RestaurantSettingsFormValues = {
    name: string;
    phone: string;
    email: string;
    address: string;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

const createInitialValues = (
    settings: RestaurantSettings,
): RestaurantSettingsFormValues => ({
    name: settings.name ?? "",
    phone: settings.phone ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
});

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
            (value) => !value || VIETNAM_PHONE_REGEX.test(value),
        ),

    email: Yup.string()
        .trim()
        .max(254, "Email không được vượt quá 254 ký tự.")
        .email("Email không hợp lệ."),

    address: Yup.string()
        .trim()
        .max(500, "Địa chỉ không được vượt quá 500 ký tự."),
});

async function saveRestaurantSettings(
    values: RestaurantSettingsFormValues,
    setSnackbar: Dispatch<SetStateAction<SnackbarState>>,
): Promise<boolean> {
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

        return result.success;
    } catch (error) {
        console.error("Failed to save restaurant settings:", error);

        setSnackbar({
            open: true,
            message: "Đã xảy ra lỗi khi lưu thông tin nhà hàng.",
            severity: "error",
        });

        return false;
    }
}

export default function RestaurantSettingsForm({
    initialSettings,
}: RestaurantSettingsFormProps) {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingValues, setPendingValues] =
        useState<RestaurantSettingsFormValues | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const initialValues = createInitialValues(initialSettings);

    return (
        <>
            <Formik<RestaurantSettingsFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnChange
                validateOnBlur
                enableReinitialize
                onSubmit={(values, { setSubmitting }) => {
                    setPendingValues({
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        address: values.address,
                    });

                    setConfirmOpen(true);
                    setSubmitting(false);
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
                    setSubmitting,
                    resetForm,
                    dirty,
                    isValid,
                }) => {
                    const isFormBusy = isSaving || isSubmitting;

                    const getErrorMessage = (
                        field: keyof RestaurantSettingsFormValues,
                    ): string => {
                        const error = errors[field];

                        return touched[field] && typeof error === "string"
                            ? error
                            : "";
                    };

                    const handleConfirmSave = async () => {
                        if (!pendingValues || isFormBusy) {
                            return;
                        }

                        setConfirmOpen(false);
                        setIsSaving(true);
                        setSubmitting(true);

                        const success = await saveRestaurantSettings(
                            pendingValues,
                            setSnackbar,
                        );

                        if (success) {
                            resetForm({
                                values: {
                                    name: pendingValues.name.trim(),
                                    phone: pendingValues.phone.trim(),
                                    email: pendingValues.email.trim(),
                                    address: pendingValues.address.trim(),
                                },
                            });
                        }

                        setPendingValues(null);
                        setSubmitting(false);
                        setIsSaving(false);
                    };

                    const handleCancelConfirmation = () => {
                        if (isFormBusy) return;

                        setConfirmOpen(false);
                        setPendingValues(null);
                    };

                    return (
                        <>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{ width: "100%", minWidth: 0 }}
                            >
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "minmax(0, 1fr)",
                                            md: "minmax(200px, 1fr) minmax(0, 2fr)",
                                        },
                                        alignItems: "stretch",
                                        gap: {
                                            xs: 3,
                                            md: 4,
                                        },
                                    }}
                                >
                                    <Stack
                                        sx={{
                                            gap: 2,
                                            minWidth: 0,
                                            alignItems: "center",
                                            textAlign: "center",
                                            pb: { xs: 3, md: 0 },
                                            pr: { xs: 0, md: 4 },
                                            borderRight: {
                                                xs: "none",
                                                md: "1px dashed var(--color-border)",
                                            },
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                initialSettings.logo_url ??
                                                undefined
                                            }
                                            alt={`Logo ${initialSettings.name}`}
                                            variant="circular"
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                flexShrink: 0,
                                                bgcolor: "var(--color-surface)",
                                                color: "var(--color-text-muted)",
                                                border: "1px solid var(--color-border)",
                                                "& .MuiAvatar-img": {
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    padding: 0,
                                                },
                                            }}
                                        >
                                            <Store
                                                size={40}
                                                strokeWidth={1.4}
                                            />
                                        </Avatar>

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 18,
                                                    fontWeight: 600,
                                                    lineHeight: 1.5,
                                                    color: "var(--color-text-primary)",
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {initialSettings.name}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    fontSize: 12,
                                                    lineHeight: 1.6,
                                                    color: "var(--color-text-muted)",
                                                }}
                                            >
                                                Tên nhà hàng
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                maxWidth: 220,
                                                fontSize: 11,
                                                lineHeight: 1.6,
                                                color: "var(--color-text-secondary)",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            Logo chỉ xem tại đây. Để thay đổi
                                            logo, hãy sử dụng tab Nhận diện
                                            thương hiệu.
                                        </Typography>
                                    </Stack>

                                    {/* edit form */}
                                    <Stack
                                        sx={{
                                            gap: 2.5,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                component="h2"
                                                sx={{
                                                    fontSize: 16,
                                                    lineHeight: 1.5,
                                                    fontWeight: 600,
                                                    color: "var(--color-text-primary)",
                                                }}
                                            >
                                                Thông tin nhà hàng
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.25,
                                                    fontSize: 12,
                                                    lineHeight: 1.6,
                                                    color: "var(--color-text-secondary)",
                                                }}
                                            >
                                                Cập nhật thông tin liên hệ và
                                                thông tin hiển thị của nhà hàng.
                                            </Typography>
                                        </Box>

                                        <Stack sx={{ gap: 3 }}>
                                            <QRTextField
                                                name="name"
                                                label="Tên nhà hàng"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                errorMessage={getErrorMessage(
                                                    "name",
                                                )}
                                                required
                                                placeholder="Nhập tên nhà hàng"
                                                autoComplete="organization"
                                                disabled={isFormBusy}
                                            />

                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                        xs: "minmax(0, 1fr)",
                                                        sm: "repeat(2, minmax(0, 1fr))",
                                                    },
                                                    gap: 2,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <QRTextField
                                                    name="phone"
                                                    label="Số điện thoại"
                                                    type="tel"
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    errorMessage={getErrorMessage(
                                                        "phone",
                                                    )}
                                                    placeholder="Ví dụ: 0912345678"
                                                    autoComplete="tel"
                                                    disabled={isFormBusy}
                                                />

                                                <QRTextField
                                                    name="email"
                                                    label="Email"
                                                    type="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    errorMessage={getErrorMessage(
                                                        "email",
                                                    )}
                                                    placeholder="Nhập email liên hệ"
                                                    autoComplete="email"
                                                    disabled={isFormBusy}
                                                />
                                            </Box>

                                            <QRTextField
                                                name="address"
                                                label="Địa chỉ"
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                errorMessage={getErrorMessage(
                                                    "address",
                                                )}
                                                placeholder="Nhập địa chỉ nhà hàng"
                                                autoComplete="street-address"
                                                disabled={isFormBusy}
                                            />
                                        </Stack>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                pt: 1,
                                            }}
                                        >
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={
                                                    !dirty ||
                                                    !isValid ||
                                                    isFormBusy
                                                }
                                                sx={{
                                                    ...buttonBaseSx,
                                                    minWidth: 140,
                                                    minHeight: 40,
                                                }}
                                            >
                                                {isFormBusy ? (
                                                    <>
                                                        <CircularProgress
                                                            size={16}
                                                            thickness={5}
                                                            color="inherit"
                                                            sx={{ mr: 1 }}
                                                        />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    "Lưu thay đổi"
                                                )}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>

                            <QRDialog
                                open={confirmOpen}
                                onClose={handleCancelConfirmation}
                                title="Xác nhận thay đổi"
                                maxWidth="xs"
                                actions={
                                    <>
                                        <Button
                                            variant="outlined"
                                            disabled={isFormBusy}
                                            onClick={handleCancelConfirmation}
                                            sx={buttonBaseCancelSx}
                                        >
                                            Hủy
                                        </Button>

                                        <Button
                                            variant="contained"
                                            disabled={
                                                isFormBusy || !pendingValues
                                            }
                                            onClick={handleConfirmSave}
                                            sx={buttonBaseSx}
                                        >
                                            {isFormBusy ? (
                                                <>
                                                    <CircularProgress
                                                        size={16}
                                                        thickness={5}
                                                        color="inherit"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                "Xác nhận và lưu"
                                            )}
                                        </Button>
                                    </>
                                }
                            >
                                <Stack sx={{ gap: 2 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            lineHeight: 1.7,
                                            color: "var(--color-text-secondary)",
                                        }}
                                    >
                                        Bạn có chắc chắn muốn cập nhật thông tin
                                        nhà hàng không?
                                    </Typography>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: "1px solid var(--color-border)",
                                            bgcolor:
                                                "var(--color-surface-hover)",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                mb: 1.5,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: "var(--color-text-primary)",
                                            }}
                                        >
                                            Thông tin sẽ được cập nhật
                                        </Typography>

                                        <Stack sx={{ gap: 1.25 }}>
                                            {[
                                                {
                                                    label: "Tên nhà hàng",
                                                    value: pendingValues?.name,
                                                },
                                                {
                                                    label: "Số điện thoại",
                                                    value: pendingValues?.phone,
                                                },
                                                {
                                                    label: "Email",
                                                    value: pendingValues?.email,
                                                },
                                                {
                                                    label: "Địa chỉ",
                                                    value: pendingValues?.address,
                                                },
                                            ].map((item) => (
                                                <Stack
                                                    key={item.label}
                                                    sx={{
                                                        flexDirection: "row",
                                                        alignItems:
                                                            "flex-start",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            fontSize: 12,
                                                            color: "var(--color-text-secondary)",
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            minWidth: 0,
                                                            fontSize: 12,
                                                            fontWeight: 500,
                                                            color: "var(--color-text-primary)",
                                                            textAlign: "right",
                                                            overflowWrap:
                                                                "anywhere",
                                                        }}
                                                    >
                                                        {item.value?.trim() ||
                                                            "Chưa cung cấp"}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                            color: "var(--color-text-secondary)",
                                        }}
                                    >
                                        Vui lòng kiểm tra thông tin trước khi
                                        xác nhận. Dữ liệu sẽ được cập nhật sau
                                        khi hệ thống xử lý thành công.
                                    </Typography>
                                </Stack>
                            </QRDialog>
                        </>
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
