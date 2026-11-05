"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

import { useTranslation } from "@/components/common/providers/useTranslation";

type TableQRCodeProps = {
    token: string;
    size?: number;
};

export default function TableQRCode({ token, size = 240 }: TableQRCodeProps) {
    const qrRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const feedbackUrl = `${siteUrl}/s/${token}`;

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const getSvgBlob = () => {
        const svg = qrRef.current?.querySelector("svg");

        if (!svg) return null;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        return new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });
    };

    const downloadSvg = () => {
        const blob = getSvgBlob();

        if (!blob) return;

        downloadBlob(blob, `${token}-qr.svg`);
    };

    const downloadPng = () => {
        const blob = getSvgBlob();

        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const image = new Image();

        image.onload = () => {
            const scale = 4;
            const canvas = document.createElement("canvas");

            canvas.width = size * scale;
            canvas.height = size * scale;

            const context = canvas.getContext("2d");

            if (!context) {
                URL.revokeObjectURL(url);
                return;
            }

            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            URL.revokeObjectURL(url);

            canvas.toBlob((pngBlob) => {
                if (!pngBlob) return;

                downloadBlob(pngBlob, `${token}-qr.png`);
            }, "image/png");
        };

        image.onerror = () => URL.revokeObjectURL(url);
        image.src = url;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Box
                ref={qrRef}
                className="qr-print-area"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    p: { xs: 1.5, sm: 2 },
                    mt: 0.5,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 2,
                    overflow: "hidden",

                    "& svg": {
                        display: "block",
                        width: "100%",
                        maxWidth: size,
                        height: "auto",
                    },

                    "@media print": {
                        width: "fit-content !important",
                        maxWidth: "100% !important",
                        mx: "auto",
                        mt: "16px",
                        p: "12px",
                        backgroundColor: "#FFFFFF !important",
                        borderRadius: "8px",
                        overflow: "visible",
                        breakInside: "avoid",
                        pageBreakInside: "avoid",

                        "& svg": {
                            display: "block",
                            width: `${size}px !important`,
                            height: `${size}px !important`,
                            maxWidth: "100%",
                        },
                    },
                }}
            >
                <QRCodeSVG
                    value={feedbackUrl}
                    size={size}
                    level="H"
                    includeMargin
                />
            </Box>

            <Typography
                variant="body2"
                className="qr-print-url"
                sx={{
                    mt: 1,
                    color: "#D1D5DB",
                    fontSize: 12,
                    lineHeight: 1.5,
                    wordBreak: "break-all",
                }}
            >
                {feedbackUrl}
            </Typography>

            <Stack
                className="qr-actions"
                sx={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                    mb: 2,

                    "@media print": {
                        display: "none !important",
                    },
                }}
            >
                <Button
                    variant="contained"
                    size="small"
                    onClick={downloadPng}
                    sx={{
                        px: 1.75,
                        minWidth: 0,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#1F2937",
                        backgroundColor: "#FFFFFF",
                        "&:hover": {
                            backgroundColor: "#E5E7EB",
                        },
                    }}
                >
                    {t("qrCode", "downloadPng")}
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={downloadSvg}
                    sx={{
                        px: 1.75,
                        minWidth: 0,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        borderColor: "#9CA3AF",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                            borderColor: "#FFFFFF",
                        },
                    }}
                >
                    {t("qrCode", "downloadSvg")}
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={handlePrint}
                    sx={{
                        px: 1.75,
                        minWidth: 0,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        borderColor: "#9CA3AF",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                            borderColor: "#FFFFFF",
                        },
                    }}
                >
                    {t("qrCode", "printQr")}
                </Button>
            </Stack>
        </>
    );
}
