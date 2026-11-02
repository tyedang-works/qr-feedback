"use client";

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Eye, EyeOff, ImagePlus, Store } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import QRDialog from "@/components/common/dialog/QRDialog";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { useTranslation } from "@/components/common/providers/useTranslation";

import { USER_ROLE_OPTIONS, USER_ROLES } from "@/lib/auth/constants";
import {
    createUserFormSchema,
    type UserFormMode,
    type UserFormValues,
} from "@/lib/auth/user-form.schema";
import { createCroppedImageFile } from "@/lib/images/crop-image";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";

const MAX_AVATAR_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function revokeBlobUrl(url: string | null) {
    if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
    }
}

type UserFormField = keyof UserFormValues;

export type UserFormSubmitResult = {
    success: boolean;
    message?: string;
    fieldErrors?: Partial<Record<UserFormField, string>>;
};

type UserFormProps = {
    open: boolean;
    mode: UserFormMode;
    initialValues: UserFormValues;
    initialAvatarUrl?: string | null;
    onClose: () => void;
    onSubmit: (
        values: UserFormValues,
        avatar: File | null,
    ) => Promise<UserFormSubmitResult>;
};

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

export default function UserForm({
    open,
    mode,
    initialValues,
    initialAvatarUrl = null,
    onClose,
    onSubmit,
}: UserFormProps) {
    const { t } = useTranslation();
    const userFormT = (key: string) => t("usersRoles", `userForm.${key}`);
    const userRoleT = (key: string) => t("userForm", key);
    const formId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const avatarUrlRef = useRef<string | null>(null);
    const cropUrlRef = useRef<string | null>(null);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
        null,
    );
    const avatarUrl = avatarPreviewUrl ?? initialAvatarUrl;
    const [cropUrl, setCropUrl] = useState<string | null>(null);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [isCropping, setIsCropping] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const isAddMode = mode === "add";

    const title = isAddMode ? userFormT("addTitle") : userFormT("editTitle");

    const showSnackbar = (
        message: string,
        severity: SnackbarState["severity"],
    ) => {
        setSnackbar({ open: true, message, severity });
    };

    const replaceAvatarPreview = (file: File | null) => {
        revokeBlobUrl(avatarUrlRef.current);

        const nextUrl = file ? URL.createObjectURL(file) : null;

        avatarUrlRef.current = nextUrl;
        setAvatarPreviewUrl(nextUrl);
        setAvatarFile(file);
    };

    useEffect(() => {
        return () => {
            revokeBlobUrl(avatarUrlRef.current);
            revokeBlobUrl(cropUrlRef.current);
        };
    }, []);

    const handleCropComplete = (_area: Area, pixels: Area) => {
        setCroppedArea(pixels);
    };

    const handleAvatarSelection = (file?: File) => {
        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            showSnackbar(userFormT("avatarFormatError"), "error");
            return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
            showSnackbar(userFormT("avatarSizeError"), "error");
            return;
        }

        revokeBlobUrl(cropUrlRef.current);

        const nextCropUrl = URL.createObjectURL(file);

        cropUrlRef.current = nextCropUrl;
        setCropFile(file);
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
        setCropFile(null);
        setCroppedArea(null);
        setCropOpen(false);
        setIsCropping(false);
    };

    const handleConfirmCrop = async () => {
        if (!cropUrl || !cropFile || !croppedArea || isCropping) {
            return;
        }

        setIsCropping(true);

        try {
            const file = await createCroppedImageFile(
                cropUrl,
                cropFile,
                croppedArea,
            );

            if (file.size > MAX_AVATAR_SIZE) {
                showSnackbar(userFormT("croppedAvatarSizeError"), "error");
                return;
            }

            replaceAvatarPreview(file);
            handleCancelCrop();
        } catch {
            showSnackbar(userFormT("imageProcessingError"), "error");
        } finally {
            setIsCropping(false);
        }
    };

    const resetAvatarState = () => {
        revokeBlobUrl(avatarUrlRef.current);
        revokeBlobUrl(cropUrlRef.current);

        avatarUrlRef.current = null;
        cropUrlRef.current = null;

        setAvatarFile(null);
        setAvatarPreviewUrl(null);

        setCropUrl(null);
        setCropFile(null);
        setCroppedArea(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropOpen(false);
        setIsCropping(false);

        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleFormSubmit = async (
        values: UserFormValues,
        helpers: FormikHelpers<UserFormValues>,
    ) => {
        const { setFieldError, setSubmitting } = helpers;

        try {
            const result = await onSubmit(
                {
                    ...values,
                    fullName: values.fullName.trim(),
                    email: values.email.trim(),
                },
                avatarFile,
            );

            if (!result.success) {
                const fieldErrors = result.fieldErrors;

                if (fieldErrors) {
                    (
                        Object.entries(fieldErrors) as [UserFormField, string][]
                    ).forEach(([field, message]) => {
                        if (message) {
                            setFieldError(field, message);
                        }
                    });
                }

                if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
                    showSnackbar(
                        result.message || userFormT("saveError"),
                        "error",
                    );
                }

                return;
            }

            showSnackbar(
                isAddMode
                    ? userFormT("addSuccess")
                    : userFormT("updateSuccess"),
                "success",
            );

            helpers.resetForm();
            resetAvatarState();
            onClose();
        } catch {
            showSnackbar(userFormT("generalError"), "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createUserFormSchema(mode)}
                enableReinitialize
                validateOnMount={false}
                validateOnChange={false}
                validateOnBlur
                onSubmit={handleFormSubmit}
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
                    const isBusy = isSubmitting || isCropping;

                    const handleClose = () => {
                        if (isBusy) return;

                        resetForm();
                        resetAvatarState();
                        onClose();
                    };

                    const clearFieldError = (field: UserFormField) => {
                        if (errors[field]) {
                            setFieldError(field, undefined);
                        }
                    };

                    return (
                        <QRDialog
                            open={open}
                            onClose={handleClose}
                            title={title}
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={handleClose}
                                        disabled={isBusy}
                                        sx={buttonBaseCancelSx}
                                    >
                                        {userFormT("cancel")}
                                    </Button>

                                    <Button
                                        type="submit"
                                        form={formId}
                                        variant="contained"
                                        disabled={isBusy}
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
                                                {userFormT("saving")}
                                            </>
                                        ) : (
                                            userFormT("save")
                                        )}
                                    </Button>
                                </>
                            }
                        >
                            <Form id={formId} noValidate>
                                <Stack sx={{ gap: 3 }}>
                                    <Stack
                                        sx={{
                                            alignItems: "center",
                                            mb: 0.5,
                                        }}
                                    >
                                        <Box
                                            component="label"
                                            htmlFor={`${formId}-avatar`}
                                            role="button"
                                            tabIndex={isBusy ? -1 : 0}
                                            aria-label={
                                                avatarUrl
                                                    ? userFormT("changeAvatar")
                                                    : userFormT("addAvatar")
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    !isBusy &&
                                                    (event.key === "Enter" ||
                                                        event.key === " ")
                                                ) {
                                                    event.preventDefault();
                                                    inputRef.current?.click();
                                                }
                                            }}
                                            sx={{
                                                position: "relative",
                                                display: "inline-flex",
                                                width: 88,
                                                height: 88,
                                                borderRadius: "50%",
                                                cursor: isBusy
                                                    ? "default"
                                                    : "pointer",
                                                overflow: "hidden",
                                                outline: "none",
                                                "&:focus-visible": {
                                                    boxShadow:
                                                        "0 0 0 3px rgba(25, 118, 210, 0.3)",
                                                },
                                                "&:hover .avatar-upload-overlay":
                                                    {
                                                        opacity: 1,
                                                    },
                                            }}
                                        >
                                            <Avatar
                                                src={avatarUrl ?? undefined}
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    bgcolor:
                                                        "var(--color-surface-active)",
                                                    color: "var(--color-text-secondary)",
                                                    fontSize: 28,
                                                }}
                                            >
                                                <Store size={32} />
                                            </Avatar>

                                            <Box
                                                className="avatar-upload-overlay"
                                                sx={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 0.5,
                                                    bgcolor:
                                                        "rgba(15, 23, 42, 0.58)",
                                                    color: "#fff",
                                                    opacity: 0,
                                                    transition:
                                                        "opacity 180ms ease",
                                                    "@media (hover: none)": {
                                                        opacity: 0.85,
                                                    },
                                                    ...(isBusy && {
                                                        display: "none",
                                                    }),
                                                }}
                                            >
                                                <ImagePlus size={23} />
                                                <Typography
                                                    sx={{
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {avatarUrl
                                                        ? userFormT(
                                                              "changeImage",
                                                          )
                                                        : userFormT(
                                                              "uploadImage",
                                                          )}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <input
                                            ref={inputRef}
                                            id={`${formId}-avatar`}
                                            hidden
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            disabled={isBusy}
                                            onChange={(event) => {
                                                handleAvatarSelection(
                                                    event.currentTarget
                                                        .files?.[0],
                                                );
                                                event.currentTarget.value = "";
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 12,
                                                color: "var(--color-text-secondary)",
                                                textAlign: "center",
                                            }}
                                        >
                                            {userFormT("avatar")}
                                        </Typography>
                                    </Stack>

                                    <QRTextField
                                        name="fullName"
                                        label={userFormT("fullName")}
                                        placeholder={userFormT(
                                            "fullNamePlaceholder",
                                        )}
                                        required
                                        value={values.fullName}
                                        onChange={(event) => {
                                            handleChange(event);
                                            clearFieldError("fullName");
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isBusy}
                                        errorMessage={
                                            touched.fullName
                                                ? errors.fullName
                                                : undefined
                                        }
                                    />

                                    {isAddMode && (
                                        <QRTextField
                                            name="email"
                                            label={userFormT("email")}
                                            placeholder={userFormT(
                                                "emailPlaceholder",
                                            )}
                                            type="email"
                                            required
                                            value={values.email}
                                            onChange={(event) => {
                                                handleChange(event);
                                                clearFieldError("email");
                                            }}
                                            onBlur={handleBlur}
                                            disabled={isBusy}
                                            errorMessage={
                                                touched.email
                                                    ? errors.email
                                                    : undefined
                                            }
                                        />
                                    )}

                                    {isAddMode && (
                                        <>
                                            <QRTextField
                                                name="password"
                                                label={userFormT("password")}
                                                placeholder={userFormT(
                                                    "passwordPlaceholder",
                                                )}
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                required
                                                value={values.password}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    clearFieldError("password");
                                                    clearFieldError(
                                                        "confirmPassword",
                                                    );
                                                }}
                                                onBlur={handleBlur}
                                                disabled={isBusy}
                                                errorMessage={
                                                    touched.password
                                                        ? errors.password
                                                        : undefined
                                                }
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    type="button"
                                                                    aria-label={
                                                                        showPassword
                                                                            ? userFormT(
                                                                                  "hidePassword",
                                                                              )
                                                                            : userFormT(
                                                                                  "showPassword",
                                                                              )
                                                                    }
                                                                    onClick={() =>
                                                                        setShowPassword(
                                                                            (
                                                                                previous,
                                                                            ) =>
                                                                                !previous,
                                                                        )
                                                                    }
                                                                    edge="end"
                                                                    disabled={
                                                                        isBusy
                                                                    }
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Eye
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                sx={{
                                                    "& input::-ms-reveal": {
                                                        display: "none",
                                                    },
                                                    "& input::-ms-clear": {
                                                        display: "none",
                                                    },
                                                }}
                                            />

                                            <QRTextField
                                                name="confirmPassword"
                                                label={userFormT(
                                                    "confirmPassword",
                                                )}
                                                placeholder={userFormT(
                                                    "confirmPasswordPlaceholder",
                                                )}
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                required
                                                value={values.confirmPassword}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    clearFieldError(
                                                        "confirmPassword",
                                                    );
                                                }}
                                                onBlur={handleBlur}
                                                disabled={isBusy}
                                                errorMessage={
                                                    touched.confirmPassword
                                                        ? errors.confirmPassword
                                                        : undefined
                                                }
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    type="button"
                                                                    aria-label={
                                                                        showConfirmPassword
                                                                            ? userFormT(
                                                                                  "hideConfirmPassword",
                                                                              )
                                                                            : userFormT(
                                                                                  "showConfirmPassword",
                                                                              )
                                                                    }
                                                                    onClick={() =>
                                                                        setShowConfirmPassword(
                                                                            (
                                                                                previous,
                                                                            ) =>
                                                                                !previous,
                                                                        )
                                                                    }
                                                                    edge="end"
                                                                    disabled={
                                                                        isBusy
                                                                    }
                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeOff
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Eye
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                sx={{
                                                    "& input::-ms-reveal": {
                                                        display: "none",
                                                    },
                                                    "& input::-ms-clear": {
                                                        display: "none",
                                                    },
                                                }}
                                            />
                                        </>
                                    )}

                                    <QRSelect
                                        name="role"
                                        label={userFormT("role")}
                                        required
                                        value={values.role}
                                        onChange={(event) => {
                                            handleChange(event);
                                            clearFieldError("role");
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isBusy}
                                        errorMessage={
                                            touched.role
                                                ? errors.role
                                                : undefined
                                        }
                                    >
                                        {USER_ROLE_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {userRoleT(
                                                    option.value ===
                                                        USER_ROLES.MANAGER
                                                        ? "manager"
                                                        : "staff",
                                                )}
                                            </MenuItem>
                                        ))}
                                    </QRSelect>
                                </Stack>
                            </Form>
                        </QRDialog>
                    );
                }}
            </Formik>

            <QRDialog
                open={cropOpen}
                onClose={isCropping ? () => {} : handleCancelCrop}
                title={userFormT("cropTitle")}
                maxWidth="sm"
                actions={
                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: 1,
                            width: "100%",
                        }}
                    >
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleCancelCrop}
                            disabled={isCropping}
                            sx={buttonBaseCancelSx}
                        >
                            {userFormT("cancel")}
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleConfirmCrop}
                            disabled={!croppedArea || isCropping}
                            sx={buttonBaseSx}
                        >
                            {isCropping ? (
                                <>
                                    <CircularProgress
                                        size={16}
                                        thickness={5}
                                        sx={{ color: "inherit", mr: 1 }}
                                    />
                                    {userFormT("processing")}
                                </>
                            ) : (
                                userFormT("useImage")
                            )}
                        </Button>
                    </Stack>
                }
            >
                {cropUrl && (
                    <Box>
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: 300,
                                bgcolor: "var(--color-surface-active)",
                                overflow: "hidden",
                                borderRadius: 1,
                            }}
                        >
                            <Cropper
                                image={cropUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography
                                sx={{
                                    mb: 1,
                                    fontSize: 13,
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                {userFormT("zoomImage")}
                            </Typography>

                            <input
                                aria-label={userFormT("zoomImage")}
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(event) =>
                                    setZoom(Number(event.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </Box>
                    </Box>
                )}
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
