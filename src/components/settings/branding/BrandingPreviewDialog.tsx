"use client";

import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import { Check, Minus, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import QRDialog from "@/components/common/dialog/QRDialog";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";

type Props = {
    open: boolean;
    imageUrl: string | null;
    file: File | null;
    title: string;
    brandingType: "logo" | "favicon";
    loading: boolean;
    onClose: () => void;
    onConfirm: (file: File) => void;
};

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}

async function createCroppedFile(
    imageUrl: string,
    file: File,
    area: Area,
    brandingType: "logo" | "favicon",
): Promise<File> {
    const image = await createImage(imageUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Không thể xử lý ảnh.");
    }

    canvas.width = area.width;
    canvas.height = area.height;

    context.drawImage(
        image,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        area.width,
        area.height,
    );

    const outputType = brandingType === "favicon" ? "image/png" : file.type;

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
            if (result) resolve(result);
            else reject(new Error("Không thể tạo ảnh crop."));
        }, outputType);
    });

    const fileName =
        brandingType === "favicon"
            ? `${file.name.replace(/\.[^.]+$/, "")}.png`
            : file.name;

    return new File([blob], fileName, {
        type: outputType,
        lastModified: Date.now(),
    });
}

export default function BrandingPreviewDialog({
    open,
    imageUrl,
    file,
    title,
    brandingType,
    loading,
    onClose,
    onConfirm,
}: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [error, setError] = useState("");

    const handleCropComplete = useCallback(
        (_area: Area, pixels: Area) => setCroppedArea(pixels),
        [],
    );

    async function handleConfirm() {
        if (!imageUrl || !file || !croppedArea || loading) return;

        try {
            setError("");

            const croppedFile = await createCroppedFile(
                imageUrl,
                file,
                croppedArea,
                brandingType,
            );

            onConfirm(croppedFile);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        } catch {
            setError("Không thể crop ảnh. Vui lòng thử lại.");
        }
    }

    return (
        <QRDialog
            open={open}
            onClose={onClose}
            title={`Crop ${title}`}
            maxWidth="sm"
            actions={
                <>
                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={onClose}
                        startIcon={<X size={15} />}
                        sx={buttonBaseCancelSx}
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="contained"
                        disabled={loading || !imageUrl || !file || !croppedArea}
                        onClick={() => void handleConfirm()}
                        startIcon={<Check size={15} />}
                        sx={buttonBaseSx}
                    >
                        Xác nhận crop
                    </Button>
                </>
            }
        >
            <Stack sx={{ gap: 2 }}>
                <Typography
                    sx={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Kéo ảnh để căn chỉnh và sử dụng thanh trượt để zoom. Ảnh sẽ
                    chỉ được lưu khi bạn nhấn Lưu thay đổi.
                </Typography>

                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: { xs: 260, sm: 320 },
                        overflow: "hidden",
                        borderRadius: 2,
                        bgcolor: "var(--color-surface-hover)",
                    }}
                >
                    {imageUrl && (
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            minZoom={1}
                            maxZoom={3}
                            cropShape="rect"
                            showGrid
                            restrictPosition
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    )}
                </Box>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Minus size={16} color="var(--color-text-secondary)" />
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(_, value) => setZoom(value as number)}
                        aria-label="Phóng to ảnh"
                    />
                    <Plus size={16} color="var(--color-text-secondary)" />
                </Stack>

                {error && (
                    <Typography
                        role="alert"
                        sx={{ fontSize: 12, color: "error.main" }}
                    >
                        {error}
                    </Typography>
                )}
            </Stack>
        </QRDialog>
    );
}
