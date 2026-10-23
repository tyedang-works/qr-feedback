"use client";

import QRDialog from "@/components/common/dialog/QRDialog";
import { APP_URL } from "@/lib/config/app";
import { buttonBaseSx } from "@/styles/button.styles";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CloudDownload } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

type QRCodePreviewDialogProps = {
    open: boolean;
    tableName: string;
    tableToken: string;
    onClose: () => void;
    onPrint: () => void;
};

function createFileName(tableName: string) {
    const normalizedName = tableName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `qr-${normalizedName || "table"}.png`;
}

async function downloadQRCode(tableName: string) {
    const svgElement = document.querySelector(
        "#qr-code-preview",
    ) as SVGSVGElement | null;

    if (!svgElement) {
        throw new Error("Không tìm thấy mã QR.");
    }

    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgClone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    const svgData = new XMLSerializer().serializeToString(svgClone);

    const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    try {
        const image = new Image();

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Không thể tạo ảnh QR."));

            image.src = svgUrl;
        });

        const canvas = document.createElement("canvas");
        const size = 1024;

        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Không thể tạo ảnh QR.");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, size, size);

        context.drawImage(image, 0, 0, size, size);

        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");

        link.href = pngUrl;
        link.download = createFileName(tableName);

        document.body.appendChild(link);
        link.click();
        link.remove();
    } finally {
        URL.revokeObjectURL(svgUrl);
    }
}

export default function QRCodePreviewDialog({
    open,
    tableName,
    tableToken,
    onClose,
    onPrint,
}: QRCodePreviewDialogProps) {
    const [downloading, setDownloading] = useState(false);

    const qrUrl = `${APP_URL}/s/${tableToken}`;

    const handleDownload = async () => {
        if (downloading) {
            return;
        }

        setDownloading(true);

        try {
            await downloadQRCode(tableName);
        } catch (error) {
            console.error("Failed to download QR code:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <QRDialog open={open} onClose={onClose} title="Xem mã QR" maxWidth="xs">
            <Stack
                spacing={3}
                sx={{
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 220,
                        height: 220,
                        p: 2,
                        border: "1px solid var(--color-border)",
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <QRCodeSVG
                        id="qr-code-preview"
                        value={qrUrl}
                        size={180}
                        level="M"
                        marginSize={4}
                    />
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            lineHeight: 1.5,
                            fontWeight: 700,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {tableName}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.75,
                            fontSize: 12,
                            lineHeight: 1.5,
                            color: "var(--color-text-secondary)",
                            wordBreak: "break-all",
                        }}
                    >
                        {qrUrl}
                    </Typography>
                </Box>

                <Stack
                    spacing={1}
                    direction="row"
                    sx={{ justifyContent: "center" }}
                >
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleDownload}
                        disabled={downloading}
                        startIcon={<CloudDownload size={18} strokeWidth={2} />}
                        sx={buttonBaseSx}
                    >
                        {downloading ? "Đang tải..." : "Tải xuống"}
                    </Button>

                    <Button
                        type="button"
                        variant="contained"
                        onClick={onPrint}
                        sx={buttonBaseSx}
                    >
                        In QR
                    </Button>
                </Stack>
            </Stack>
        </QRDialog>
    );
}
