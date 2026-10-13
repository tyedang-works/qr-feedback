"use client";

import { faBuilding, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { updateRestaurantSettings } from "@/app/dashboard/settings/actions";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";
import { VIETNAM_PHONE_REGEX } from "@/constants/validation.constants";
import type { RestaurantSettings } from "@/lib/restaurant/types";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import QRDialog from "../common/dialog/QRDialog";

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

const sectionTitleSx = {
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 600,
    color: "#193B56",
};

const sectionDescriptionSx = {
    mt: 0.25,
    fontSize: 12,
    lineHeight: 1.6,
    color: "#667085",
};

async function saveRestaurantSettings(
    values: RestaurantSettingsFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>,
) {
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
        console.error("Failed to save restaurant settings:", error);

        setSnackbar({
            open: true,
            message: "Đã xảy ra lỗi khi lưu thông tin nhà hàng.",
            severity: "error",
        });
    } finally {
        setSubmitting(false);
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

    const handleConfirmSave = async (
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        if (!pendingValues || isSaving) {
            return;
        }

        setConfirmOpen(false);
        setIsSaving(true);
        setSubmitting(true);

        await saveRestaurantSettings(
            pendingValues,
            (submitting) => {
                setSubmitting(submitting);
                setIsSaving(submitting);
            },
            setSnackbar,
        );

        setPendingValues(null);
    };

    return (
        <>
            <Formik<RestaurantSettingsFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnChange
                validateOnBlur
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
                    dirty,
                }) => {
                    const getErrorMessage = (
                        field: keyof RestaurantSettingsFormValues,
                    ): string => {
                        const error = errors[field];

                        return touched[field] && typeof error === "string"
                            ? error
                            : "";
                    };

                    return (
                        <>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{ width: "100%", minWidth: 0 }}
                            >
                                <Stack sx={{ gap: 3 }}>
                                    <Box>
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 1.5,
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: 2,
                                                    bgcolor: "#EAF3F0",
                                                    color: "#237A62",
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faStore}
                                                    style={{ fontSize: 16 }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography sx={sectionTitleSx}>
                                                    Thông tin cơ bản
                                                </Typography>
                                                <Typography
                                                    sx={sectionDescriptionSx}
                                                >
                                                    Tên và số điện thoại nhà
                                                    hàng.
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "minmax(0, 1fr)",
                                                    md: "repeat(2, minmax(0, 1fr))",
                                                },
                                                gap: { xs: 2.5, md: 3 },
                                            }}
                                        >
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
                                                disabled={
                                                    isSaving || isSubmitting
                                                }
                                            />

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
                                                disabled={
                                                    isSaving || isSubmitting
                                                }
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            height: "1px",
                                            bgcolor: "#EAECF0",
                                        }}
                                    />

                                    <Box>
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 1.5,
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: 2,
                                                    bgcolor: "#F2F4F7",
                                                    color: "#475467",
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faBuilding}
                                                    style={{ fontSize: 16 }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography sx={sectionTitleSx}>
                                                    Thông tin liên hệ
                                                </Typography>
                                                <Typography
                                                    sx={sectionDescriptionSx}
                                                >
                                                    Email và địa chỉ nhà hàng.
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "minmax(0, 1fr)",
                                                    md: "repeat(2, minmax(0, 1fr))",
                                                },
                                                gap: { xs: 2.5, md: 3 },
                                            }}
                                        >
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
                                                disabled={
                                                    isSaving || isSubmitting
                                                }
                                            />

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
                                                disabled={
                                                    isSaving || isSubmitting
                                                }
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            pt: 2,
                                            borderTop: "1px solid #EAECF0",
                                        }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={
                                                !dirty ||
                                                isSaving ||
                                                isSubmitting
                                            }
                                            sx={buttonBaseSx}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>

                            <QRDialog
                                open={confirmOpen}
                                onClose={() => {
                                    if (!isSaving) {
                                        setConfirmOpen(false);
                                        setPendingValues(null);
                                    }
                                }}
                                title="Xác nhận thay đổi"
                                maxWidth="xs"
                                actions={
                                    <>
                                        <Button
                                            variant="outlined"
                                            disabled={isSaving}
                                            onClick={() => {
                                                setConfirmOpen(false);
                                                setPendingValues(null);
                                            }}
                                            sx={buttonBaseCancelSx}
                                        >
                                            Hủy
                                        </Button>

                                        <Button
                                            variant="contained"
                                            disabled={
                                                isSaving || !pendingValues
                                            }
                                            onClick={() =>
                                                handleConfirmSave(setSubmitting)
                                            }

                                            sx={buttonBaseSx}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <CircularProgress
                                                        size={16}
                                                        thickness={5}
                                                        color="inherit"
                                                    />
                                                    &nbsp; Đang lưu...
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
                                            color: "#475467",
                                        }}
                                    >
                                        Bạn có chắc chắn muốn cập nhật thông tin
                                        nhà hàng không?
                                    </Typography>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: "1px solid #EAECF0",
                                            bgcolor: "#F9FAFB",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                mb: 1.5,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: "#344054",
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
                                                            color: "#667085",
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            minWidth: 0,
                                                            fontSize: 12,
                                                            fontWeight: 500,
                                                            color: "#344054",
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
                                            color: "#667085",
                                        }}
                                    >
                                        Vui lòng kiểm tra thông tin trước khi
                                        xác nhận. Thao tác này sẽ gửi dữ liệu
                                        mới lên hệ thống.
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
