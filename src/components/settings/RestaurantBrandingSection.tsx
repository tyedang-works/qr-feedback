"use client";

import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import {
    ImagePlus,
    ImageUp,
    Palette,
    RotateCcw,
    Save,
    Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
    deleteRestaurantBranding,
    uploadRestaurantBranding,
} from "@/app/dashboard/settings/branding-actions";
import QRSnackbar from "@/components/common/feedback/QRSnackbar";
import BrandingDeleteDialog from "@/components/settings/branding/BrandingDeleteDialog";
import BrandingPreviewDialog from "@/components/settings/branding/BrandingPreviewDialog";
import type { RestaurantSettings } from "@/lib/restaurant/types";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";

type BrandingType = "logo" | "favicon";
type BrandingImages = Record<BrandingType, string | null>;
type PendingFiles = Record<BrandingType, File | null>;
type PendingUrls = Record<BrandingType, string | null>;
type PendingDeletes = Record<BrandingType, boolean>;

type SnackbarState = {
    open: boolean;
    message: string;
    severity: "success" | "error";
};

type PreviewState = {
    type: BrandingType;
    file: File;
    url: string;
};

type Props = {
    initialSettings: Pick<RestaurantSettings, "logo_url" | "favicon_url">;
};

const MAX_FILE_SIZE = 1024 * 1024;

const BRANDING_TYPES: BrandingType[] = ["logo", "favicon"];

const BRANDING_ITEMS = [
    {
        type: "logo",
        title: "Logo nhà hàng",
        description: "Ảnh đại diện thương hiệu của nhà hàng.",
        recommendation: "Khuyên dùng ảnh vuông hoặc ngang.",
    },
    {
        type: "favicon",
        title: "Favicon",
        description: "Biểu tượng trên tab trình duyệt.",
        recommendation: "Khuyên dùng ảnh vuông.",
    },
] as const satisfies {
    type: BrandingType;
    title: string;
    description: string;
    recommendation: string;
}[];

const sectionTitleSx = {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-text-primary)",
};

const sectionDescriptionSx = {
    mt: 0.5,
    fontSize: 12,
    lineHeight: 1.6,
    color: "var(--color-text-secondary)",
};

const createPendingFiles = (): PendingFiles => ({
    logo: null,
    favicon: null,
});

const createPendingUrls = (): PendingUrls => ({
    logo: null,
    favicon: null,
});

const createPendingDeletes = (): PendingDeletes => ({
    logo: false,
    favicon: false,
});

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

const ICO_MIME_TYPES = ["image/x-icon", "image/vnd.microsoft.icon"] as const;

const isIcoFile = (file: File) =>
    ICO_MIME_TYPES.includes(file.type as (typeof ICO_MIME_TYPES)[number]) ||
    /\.ico$/i.test(file.name);

const isAllowedFile = (file: File) =>
    ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    ) || isIcoFile(file);

export default function RestaurantBrandingSection({ initialSettings }: Props) {
    const [images, setImages] = useState<BrandingImages>({
        logo: initialSettings.logo_url,
        favicon: initialSettings.favicon_url,
    });

    const [pendingFiles, setPendingFiles] =
        useState<PendingFiles>(createPendingFiles);

    const [pendingUrls, setPendingUrls] =
        useState<PendingUrls>(createPendingUrls);

    const [pendingDeletes, setPendingDeletes] =
        useState<PendingDeletes>(createPendingDeletes);

    const [preview, setPreview] = useState<PreviewState | null>(null);
    const [deleteType, setDeleteType] = useState<BrandingType | null>(null);
    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success",
    });

    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const objectUrlsRef = useRef(new Set<string>());

    const hasChanges = BRANDING_TYPES.some(
        (type) => pendingFiles[type] !== null || pendingDeletes[type],
    );

    useEffect(() => {
        const objectUrls = objectUrlsRef.current;

        return () => {
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
            objectUrls.clear();
        };
    }, []);

    const createManagedObjectUrl = (file: File) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.add(url);

        return url;
    };

    const revokeManagedObjectUrl = (url: string | null | undefined) => {
        if (!url || !objectUrlsRef.current.has(url)) return;

        URL.revokeObjectURL(url);
        objectUrlsRef.current.delete(url);
    };

    const showSnackbar = (
        message: string,
        severity: SnackbarState["severity"],
    ) => {
        setSnackbar({ open: true, message, severity });
    };

    const getInputRef = (type: BrandingType) =>
        type === "logo" ? logoInputRef : faviconInputRef;

    const getDisplayUrl = (type: BrandingType) => {
        if (pendingDeletes[type]) return null;

        if (preview?.type === type) return preview.url;

        return pendingUrls[type] ?? images[type];
    };

    const handleFileSelection = (type: BrandingType, file?: File) => {
        if (!file) return;

        if (!isAllowedFile(file) || (type === "logo" && isIcoFile(file))) {
            showSnackbar(
                type === "favicon"
                    ? "Chỉ chấp nhận ảnh PNG, JPEG, WebP hoặc ICO."
                    : "Logo chỉ hỗ trợ PNG, JPEG hoặc WebP.",
                "error",
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showSnackbar("Dung lượng ảnh không được vượt quá 1 MB.", "error");
            return;
        }

        if (preview) {
            revokeManagedObjectUrl(preview.url);
        }

        if (type === "favicon" && isIcoFile(file)) {
            const url = createManagedObjectUrl(file);

            revokeManagedObjectUrl(pendingUrls[type]);

            setPendingFiles((current) => ({
                ...current,
                [type]: file,
            }));

            setPendingUrls((current) => ({
                ...current,
                [type]: url,
            }));

            setPendingDeletes((current) => ({
                ...current,
                [type]: false,
            }));

            setPreview(null);
            return;
        }

        setPreview({
            type,
            file,
            url: createManagedObjectUrl(file),
        });
    };

    const handleCropConfirm = (croppedFile: File) => {
        if (!preview) return;

        const { type, url } = preview;
        const pendingUrl = pendingUrls[type];

        revokeManagedObjectUrl(url);
        revokeManagedObjectUrl(pendingUrl);

        setPendingFiles((current) => ({
            ...current,
            [type]: croppedFile,
        }));

        setPendingUrls((current) => ({
            ...current,
            [type]: createManagedObjectUrl(croppedFile),
        }));

        setPendingDeletes((current) => ({
            ...current,
            [type]: false,
        }));

        setPreview(null);
    };

    const handleClosePreview = () => {
        if (loading) return;

        setPreview(null);
    };

    const handleCancelChanges = () => {
        if (loading) return;

        revokeManagedObjectUrl(preview?.url);

        BRANDING_TYPES.forEach((type) => {
            revokeManagedObjectUrl(pendingUrls[type]);
        });

        setPendingFiles(createPendingFiles());
        setPendingUrls(createPendingUrls());
        setPendingDeletes(createPendingDeletes());
        setPreview(null);
        setDeleteType(null);

        showSnackbar("Đã hủy các thay đổi chưa lưu.", "success");
    };

    const saveBrandingType = async (
        type: BrandingType,
        file: File | null,
        shouldDelete: boolean,
    ) => {
        if (file) {
            const formData = new FormData();
            formData.set("type", type);
            formData.set("file", file);

            return uploadRestaurantBranding(formData);
        }

        if (shouldDelete) {
            return deleteRestaurantBranding(type);
        }

        return null;
    };

    const handleSave = async () => {
        if (!hasChanges || loading) return;

        setLoading(true);

        const errors: string[] = [];
        const successfulTypes: BrandingType[] = [];

        try {
            for (const type of BRANDING_TYPES) {
                const file = pendingFiles[type];
                const shouldDelete = pendingDeletes[type];

                if (!file && !shouldDelete) continue;

                const label = type === "logo" ? "Logo" : "Favicon";

                try {
                    const result = await saveBrandingType(
                        type,
                        file,
                        shouldDelete,
                    );

                    if (!result) continue;

                    if (!result.success) {
                        errors.push(`${label}: ${result.message}`);
                        continue;
                    }

                    setImages((current) => ({
                        ...current,
                        [type]: "url" in result ? result.url : null,
                    }));

                    successfulTypes.push(type);
                } catch (error) {
                    console.error(`Failed to save ${type}:`, error);
                    errors.push(`${label}: Không thể lưu thay đổi.`);
                }
            }

            if (successfulTypes.length > 0) {
                successfulTypes.forEach((type) => {
                    revokeManagedObjectUrl(pendingUrls[type]);
                });

                setPendingFiles((current) => {
                    const next = { ...current };

                    successfulTypes.forEach((type) => {
                        next[type] = null;
                    });

                    return next;
                });

                setPendingUrls((current) => {
                    const next = { ...current };

                    successfulTypes.forEach((type) => {
                        next[type] = null;
                    });

                    return next;
                });

                setPendingDeletes((current) => {
                    const next = { ...current };

                    successfulTypes.forEach((type) => {
                        next[type] = false;
                    });

                    return next;
                });
            }

            if (errors.length > 0) {
                showSnackbar(errors.join(" "), "error");
            } else if (successfulTypes.length > 0) {
                showSnackbar(
                    "Đã lưu nhận diện thương hiệu thành công.",
                    "success",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteType) return;

        const type = deleteType;

        if (pendingFiles[type] && !images[type]) {
            revokeManagedObjectUrl(pendingUrls[type]);

            setPendingFiles((current) => ({
                ...current,
                [type]: null,
            }));

            setPendingUrls((current) => ({
                ...current,
                [type]: null,
            }));
        } else {
            setPendingDeletes((current) => ({
                ...current,
                [type]: true,
            }));
        }

        setDeleteType(null);
    };

    return (
        <>
            <Stack sx={{ gap: 2.5, minWidth: 0 }}>
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            borderRadius: 2,
                            bgcolor: "var(--color-surface-active)",
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        <Palette size={18} aria-hidden="true" />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={sectionTitleSx}>
                            Nhận diện thương hiệu
                        </Typography>

                        <Typography sx={sectionDescriptionSx}>
                            Quản lý logo và favicon của nhà hàng.
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        },
                        gap: 2,
                    }}
                >
                    {BRANDING_ITEMS.map((item) => {
                        const { type } = item;
                        const imageUrl = getDisplayUrl(type);
                        const isDeleted = pendingDeletes[type];
                        const pendingFile = pendingFiles[type];
                        const isPending = Boolean(pendingFile);
                        const inputRef = getInputRef(type);

                        return (
                            <Box
                                key={type}
                                sx={{
                                    minWidth: 0,
                                    p: 2,
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 2,
                                    bgcolor: "var(--color-surface)",
                                }}
                            >
                                <Stack sx={{ gap: 1.5 }}>
                                    <Box>
                                        <Typography sx={sectionTitleSx}>
                                            {item.title}
                                        </Typography>

                                        <Typography sx={sectionDescriptionSx}>
                                            {item.description}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            height: 150,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            p: 2,
                                            border: "1px dashed var(--color-border)",
                                            borderRadius: 2,
                                            bgcolor:
                                                "var(--color-surface-hover)",
                                        }}
                                    >
                                        {imageUrl ? (
                                            <Box
                                                component="img"
                                                src={imageUrl}
                                                alt={item.title}
                                                sx={{
                                                    maxWidth: "100%",
                                                    maxHeight: 110,
                                                    objectFit: "contain",
                                                    opacity: isDeleted
                                                        ? 0.35
                                                        : 1,
                                                }}
                                            />
                                        ) : (
                                            <Stack
                                                sx={{
                                                    alignItems: "center",
                                                    gap: 1,
                                                    color: "var(--color-text-muted)",
                                                }}
                                            >
                                                <ImagePlus size={28} />

                                                <Typography
                                                    sx={{ fontSize: 12 }}
                                                >
                                                    {isDeleted
                                                        ? "Ảnh sẽ bị xóa khi lưu"
                                                        : "Chưa có hình ảnh"}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Box>

                                    <Typography sx={sectionDescriptionSx}>
                                        {item.recommendation} Tối đa 1 MB. Hỗ
                                        trợ{" "}
                                        {type === "favicon"
                                            ? "PNG, JPEG, WebP và ICO."
                                            : "PNG, JPEG và WebP."}
                                    </Typography>

                                    {isPending && (
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: "var(--color-text-secondary)",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            Ảnh mới: {pendingFile?.name}
                                        </Typography>
                                    )}

                                    {isDeleted && (
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: "error.main",
                                            }}
                                        >
                                            Đã đánh dấu xóa — chưa áp dụng.
                                        </Typography>
                                    )}

                                    <input
                                        ref={inputRef}
                                        hidden
                                        type="file"
                                        accept={
                                            type === "favicon"
                                                ? "image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico"
                                                : "image/png,image/jpeg,image/webp"
                                        }
                                        disabled={loading}
                                        onChange={(event) => {
                                            handleFileSelection(
                                                type,
                                                event.target.files?.[0],
                                            );

                                            event.target.value = "";
                                        }}
                                    />

                                    <Stack
                                        sx={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            disabled={loading}
                                            onClick={() =>
                                                inputRef.current?.click()
                                            }
                                            startIcon={<ImageUp size={15} />}
                                            sx={{
                                                ...buttonBaseSx,
                                                minWidth: 0,
                                                minHeight: 36,
                                                px: 1.5,
                                                fontSize: 12,
                                            }}
                                        >
                                            {imageUrl ? "Thay ảnh" : "Chọn ảnh"}
                                        </Button>

                                        {(images[type] || isPending) &&
                                            !isDeleted && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={loading}
                                                    onClick={() =>
                                                        setDeleteType(type)
                                                    }
                                                    startIcon={
                                                        <Trash2 size={14} />
                                                    }
                                                    sx={{
                                                        minHeight: 36,
                                                        textTransform: "none",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    Xóa
                                                </Button>
                                            )}

                                        {isDeleted && (
                                            <Button
                                                variant="outlined"
                                                disabled={loading}
                                                onClick={() =>
                                                    setPendingDeletes(
                                                        (current) => ({
                                                            ...current,
                                                            [type]: false,
                                                        }),
                                                    )
                                                }
                                                sx={buttonBaseCancelSx}
                                            >
                                                Hoàn tác xóa
                                            </Button>
                                        )}
                                    </Stack>
                                </Stack>
                            </Box>
                        );
                    })}
                </Box>

                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column-reverse",
                            sm: "row",
                        },
                        justifyContent: "flex-end",
                        gap: 1,
                        pt: 2,
                        pb: 2,
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={!hasChanges || loading}
                        onClick={handleCancelChanges}
                        startIcon={<RotateCcw size={14} />}
                        sx={buttonBaseCancelSx}
                    >
                        Hủy thay đổi
                    </Button>

                    <Button
                        variant="contained"
                        disabled={!hasChanges || loading}
                        onClick={() => void handleSave()}
                        startIcon={
                            loading ? (
                                <CircularProgress size={15} color="inherit" />
                            ) : (
                                <Save size={14} />
                            )
                        }
                        sx={{ ...buttonBaseSx, minWidth: 150 }}
                    >
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </Stack>
            </Stack>

            <BrandingPreviewDialog
                open={Boolean(preview)}
                imageUrl={preview?.url ?? null}
                file={preview?.file ?? null}
                title={preview?.type === "favicon" ? "favicon" : "logo"}
                brandingType={preview?.type ?? "logo"}
                loading={loading}
                onClose={handleClosePreview}
                onConfirm={handleCropConfirm}
            />

            <BrandingDeleteDialog
                open={deleteType !== null}
                title={deleteType === "logo" ? "logo nhà hàng" : "favicon"}
                loading={loading}
                onClose={() => setDeleteType(null)}
                onConfirm={handleConfirmDelete}
            />

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
