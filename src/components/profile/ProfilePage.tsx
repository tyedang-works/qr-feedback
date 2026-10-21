"use client";

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Slider,
    Stack,
    Typography,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Camera, RotateCcw, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import * as yup from "yup";

import {
    updateProfileAction,
    type ProfileData,
} from "@/app/dashboard/profile/actions";
import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRTextField from "@/components/common/input/QRTextField";
import { createCroppedImageFile } from "@/lib/images/crop-image";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import PageHeader from "../common/layout/PageHeader";
import RoleChip from "../common/RoleChip";

const MAX_AVATAR_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const validationSchema = yup.object({
    fullName: yup
        .string()
        .trim()
        .required("Vui lòng nhập họ và tên.")
        .max(100, "Họ và tên không được vượt quá 100 ký tự."),
});

type ProfileFormValues = {
    fullName: string;
};

type ProfilePageProps = {
    profile: ProfileData;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

export default function ProfilePage({ profile }: ProfilePageProps) {
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const avatarUrlRef = useRef<string | null>(null);
    const cropUrlRef = useRef<string | null>(null);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        profile.avatarUrl,
    );

    const [cropOpen, setCropOpen] = useState(false);
    const [cropUrl, setCropUrl] = useState<string | null>(null);
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const revokeBlobUrl = useCallback((url: string | null) => {
        if (url?.startsWith("blob:")) {
            URL.revokeObjectURL(url);
        }
    }, []);

    const showSnackbar = useCallback(
        (message: string, severity: SnackbarState["severity"]) => {
            setSnackbar({
                open: true,
                message,
                severity,
            });
        },
        [],
    );

    const handleCropComplete = useCallback((_area: Area, pixels: Area) => {
        setCroppedArea(pixels);
    }, []);

    useEffect(() => {
        return () => {
            revokeBlobUrl(avatarUrlRef.current);
            revokeBlobUrl(cropUrlRef.current);
        };
    }, [revokeBlobUrl]);

    const handleAvatarSelection = (file?: File) => {
        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            showSnackbar("Chỉ chấp nhận ảnh PNG, JPEG hoặc WebP.", "error");
            return;
        }

        if (file.size === 0 || file.size > MAX_AVATAR_SIZE) {
            showSnackbar("Ảnh phải có dung lượng tối đa 1 MB.", "error");
            return;
        }

        revokeBlobUrl(cropUrlRef.current);

        const nextCropUrl = URL.createObjectURL(file);
        cropUrlRef.current = nextCropUrl;

        setSourceFile(file);
        setCropUrl(nextCropUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedArea(null);
        setCropOpen(true);
    };

    const handleCancelCrop = () => {
        revokeBlobUrl(cropUrlRef.current);
        cropUrlRef.current = null;

        setCropUrl(null);
        setSourceFile(null);
        setCroppedArea(null);
        setCropOpen(false);
    };

    const handleConfirmCrop = async () => {
        if (!cropUrl || !sourceFile || !croppedArea || isCropping) {
            return;
        }

        setIsCropping(true);

        try {
            const file = await createCroppedImageFile(
                cropUrl,
                sourceFile,
                croppedArea,
            );

            if (file.size === 0 || file.size > MAX_AVATAR_SIZE) {
                showSnackbar(
                    "Ảnh sau khi crop vượt quá 1 MB. Vui lòng chọn ảnh khác hoặc crop vùng nhỏ hơn.",
                    "error",
                );
                return;
            }

            const nextPreview = URL.createObjectURL(file);

            revokeBlobUrl(avatarUrlRef.current);
            avatarUrlRef.current = nextPreview;

            setAvatarFile(file);
            setAvatarPreview(nextPreview);
            handleCancelCrop();
        } catch {
            showSnackbar(
                "Không thể xử lý ảnh. Vui lòng chọn ảnh khác.",
                "error",
            );
        } finally {
            setIsCropping(false);
        }
    };

    const handleResetAvatar = () => {
        revokeBlobUrl(avatarUrlRef.current);
        avatarUrlRef.current = null;

        setAvatarFile(null);
        setAvatarPreview(profile.avatarUrl);
    };

    const handleSubmit = async (
        values: ProfileFormValues,
        helpers: FormikHelpers<ProfileFormValues>,
    ) => {
        try {
            const result = await updateProfileAction({
                fullName: values.fullName.trim(),
                avatar: avatarFile,
            });

            if (!result.success) {
                if (result.fieldErrors?.fullName) {
                    helpers.setFieldError(
                        "fullName",
                        result.fieldErrors.fullName,
                    );
                }

                if (result.fieldErrors?.avatar) {
                    showSnackbar(result.fieldErrors.avatar, "error");
                } else {
                    showSnackbar(result.message, "error");
                }

                return;
            }

            if (result.profile) {
                helpers.resetForm({
                    values: {
                        fullName: result.profile.fullName,
                    },
                });

                setAvatarPreview(result.profile.avatarUrl);
            }

            revokeBlobUrl(avatarUrlRef.current);
            avatarUrlRef.current = null;
            setAvatarFile(null);

            showSnackbar(result.message, "success");
            router.refresh();
        } catch {
            showSnackbar(
                "Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng thử lại.",
                "error",
            );
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <>
            <Stack
                sx={{
                    gap: 3,
                    width: "100%",
                    minWidth: 0,
                }}
            >
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
                        title="Hồ sơ cá nhân"
                        subtitle="Quản lý thông tin cá nhân và ảnh đại diện của bạn."
                        icon={UserRound}
                    />
                </Stack>

                <Formik
                    initialValues={{
                        fullName: profile.fullName,
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize
                    validateOnBlur
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        isSubmitting,
                        dirty,
                        handleChange,
                        handleBlur,
                        resetForm,
                    }) => {
                        const isBusy = isSubmitting || isCropping;
                        const hasChanges = dirty || avatarFile !== null;

                        const handleCancelChanges = () => {
                            resetForm({
                                values: {
                                    fullName: profile.fullName,
                                },
                            });

                            handleResetAvatar();
                        };

                        return (
                            <Form>
                                <Stack
                                    sx={{
                                        flexDirection: {
                                            xs: "column",
                                            lg: "row",
                                        },
                                        alignItems: "stretch",
                                        gap: 2,
                                        width: "100%",
                                        minWidth: 0,
                                    }}
                                >
                                    {/* avatar */}
                                    <Box
                                        sx={{
                                            width: {
                                                xs: "100%",
                                                lg: 320,
                                            },
                                            flexShrink: 0,
                                            p: { xs: 3, sm: 4 },
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            bgcolor: "background.paper",
                                            boxShadow:
                                                "0 4px 16px rgba(16, 24, 40, 0.04)",
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                alignItems: "center",
                                                textAlign: "center",
                                            }}
                                        >
                                            <Box
                                                role="button"
                                                tabIndex={0}
                                                aria-label="Cập nhật ảnh đại diện"
                                                aria-disabled={isBusy}
                                                onClick={() => {
                                                    if (!isBusy) {
                                                        inputRef.current?.click();
                                                    }
                                                }}
                                                onKeyDown={(event) => {
                                                    if (
                                                        !isBusy &&
                                                        (event.key ===
                                                            "Enter" ||
                                                            event.key === " ")
                                                    ) {
                                                        event.preventDefault();
                                                        inputRef.current?.click();
                                                    }
                                                }}
                                                sx={{
                                                    position: "relative",
                                                    width: {
                                                        xs: 180,
                                                        sm: 200,
                                                    },
                                                    height: {
                                                        xs: 180,
                                                        sm: 200,
                                                    },
                                                    flexShrink: 0,
                                                    borderRadius: "50%",
                                                    cursor: isBusy
                                                        ? "default"
                                                        : "pointer",
                                                    outline: "none",
                                                    "&:hover .profile-avatar-overlay":
                                                        {
                                                            opacity: 1,
                                                        },
                                                    "&:focus-visible .profile-avatar-overlay":
                                                        {
                                                            opacity: 1,
                                                        },
                                                    "&:focus-visible": {
                                                        boxShadow:
                                                            "0 0 0 3px rgba(25, 59, 86, 0.3)",
                                                    },
                                                }}
                                            >
                                                <Avatar
                                                    src={
                                                        avatarPreview ??
                                                        undefined
                                                    }
                                                    alt={profile.fullName}
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        bgcolor: "action.hover",
                                                        color: "text.secondary",
                                                        fontSize: 52,
                                                    }}
                                                >
                                                    {profile.fullName
                                                        .trim()
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </Avatar>

                                                <Box
                                                    className="profile-avatar-overlay"
                                                    sx={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: 1,
                                                        borderRadius: "50%",
                                                        color: "#fff",
                                                        bgcolor:
                                                            "rgba(16, 24, 40, 0.58)",
                                                        opacity: {
                                                            xs: 1,
                                                            md: 0,
                                                        },
                                                        transition:
                                                            "opacity 180ms ease",
                                                    }}
                                                >
                                                    <Camera size={28} />

                                                    <Typography
                                                        sx={{
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Cập nhật ảnh
                                                    </Typography>
                                                </Box>

                                                <input
                                                    ref={inputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    hidden
                                                    disabled={isBusy}
                                                    onChange={(event) => {
                                                        handleAvatarSelection(
                                                            event.currentTarget
                                                                .files?.[0],
                                                        );

                                                        event.currentTarget.value =
                                                            "";
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                component="h2"
                                                sx={{
                                                    mt: 2.5,
                                                    mb: 1,
                                                    fontSize: 20,
                                                    lineHeight: 1.4,
                                                    fontWeight: 700,
                                                    color: "text.primary",
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {profile.fullName ||
                                                    "Người dùng"}
                                            </Typography>

                                            {profile.role && (
                                                <RoleChip role={profile.role} />
                                            )}

                                            <Typography
                                                sx={{
                                                    mt: 2.5,
                                                    maxWidth: 260,
                                                    fontSize: 12,
                                                    lineHeight: 1.7,
                                                    fontStyle: "italic",
                                                    color: "text.secondary",
                                                }}
                                            >
                                                Nhấn vào ảnh đại diện để thay
                                                đổi. Hỗ trợ PNG, JPEG hoặc WebP,
                                                tối đa 1 MB.
                                            </Typography>

                                            {avatarFile && (
                                                <Box
                                                    component={"div"}
                                                    sx={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        mt: 2,
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        onClick={
                                                            handleResetAvatar
                                                        }
                                                        startIcon={
                                                            <RotateCcw
                                                                size={12}
                                                            />
                                                        }
                                                        sx={{
                                                            minWidth: 0,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            textTransform:
                                                                "none",
                                                            color: "#475467",
                                                        }}
                                                    >
                                                        Hoàn tác ảnh
                                                    </Button>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>

                                    {/* form */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                            p: { xs: 2.5, sm: 3 },
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            bgcolor: "background.paper",
                                            boxShadow:
                                                "0 4px 16px rgba(16, 24, 40, 0.04)",
                                        }}
                                    >
                                        <Typography
                                            component="h2"
                                            sx={{
                                                fontSize: 16,
                                                lineHeight: 1.5,
                                                fontWeight: 700,
                                                color: "text.primary",
                                            }}
                                        >
                                            Thông tin cá nhân
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                mb: 2.5,
                                                fontSize: 12,
                                                lineHeight: 1.6,
                                                color: "text.secondary",
                                            }}
                                        >
                                            Cập nhật thông tin cá nhân và thông
                                            tin hiển thị của tài khoản.
                                        </Typography>

                                        <Stack
                                            sx={{
                                                gap: 2.5,
                                            }}
                                        >
                                            <QRTextField
                                                name="fullName"
                                                label="Họ và tên"
                                                placeholder="Nhập họ và tên"
                                                value={values.fullName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                errorMessage={
                                                    touched.fullName
                                                        ? errors.fullName
                                                        : undefined
                                                }
                                                required
                                                disabled={isBusy}
                                            />

                                            <QRTextField
                                                label="Email"
                                                value={profile.email}
                                                disabled
                                                slotProps={{
                                                    input: {
                                                        readOnly: true,
                                                    },
                                                }}
                                            />
                                        </Stack>

                                        <Stack
                                            sx={{
                                                mt: 3,
                                                flexDirection: "row",
                                                justifyContent: "flex-end",
                                                alignItems: "center",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                sx={buttonBaseCancelSx}
                                                disabled={isBusy || !hasChanges}
                                                onClick={handleCancelChanges}
                                            >
                                                Hủy thay đổi
                                            </Button>

                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={buttonBaseSx}
                                                disabled={isBusy || !hasChanges}
                                                startIcon={
                                                    isSubmitting ? (
                                                        <CircularProgress
                                                            size={16}
                                                            color="inherit"
                                                        />
                                                    ) : undefined
                                                }
                                            >
                                                {isSubmitting
                                                    ? "Đang lưu..."
                                                    : "Lưu thay đổi"}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Form>
                        );
                    }}
                </Formik>
            </Stack>

            <QRDialog
                open={cropOpen}
                onClose={handleCancelCrop}
                title="Căn chỉnh ảnh đại diện"
                maxWidth="sm"
                actions={
                    <>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={buttonBaseCancelSx}
                            onClick={handleCancelCrop}
                            disabled={isCropping}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="button"
                            sx={buttonBaseSx}
                            variant="contained"
                            onClick={handleConfirmCrop}
                            disabled={!croppedArea || isCropping}
                            startIcon={
                                isCropping ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : undefined
                            }
                        >
                            {isCropping ? "Đang xử lý..." : "Crop"}
                        </Button>
                    </>
                }
            >
                <Box
                    sx={{
                        position: "relative",
                        height: { xs: 300, sm: 380 },
                        overflow: "hidden",
                        borderRadius: 1.5,
                        bgcolor: "#101828",
                    }}
                >
                    {cropUrl && (
                        <Cropper
                            image={cropUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    )}
                </Box>

                <Stack sx={{ mt: 2, gap: 1 }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        Thu phóng ảnh
                    </Typography>

                    <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(_, value) => setZoom(value as number)}
                        disabled={isCropping}
                    />
                </Stack>
            </QRDialog>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() =>
                    setSnackbar((current) => ({
                        ...current,
                        open: false,
                    }))
                }
            />
        </>
    );
}
