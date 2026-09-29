"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

type TableQRCodeProps = {
    token: string;
    size?: number;
};

export default function TableQRCode({ token, size = 240 }: TableQRCodeProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const feedbackUrl = `${siteUrl}/s/${token}`;

    const downloadSvg = () => {
        const svg = qrRef.current?.querySelector("svg");

        if (!svg) {
            return;
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const blob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${token}-qr.svg`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const downloadPng = () => {
        const svg = qrRef.current?.querySelector("svg");

        if (!svg) {
            return;
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const blob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });

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

            context.fillStyle = "#ffffff";

            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            URL.revokeObjectURL(url);

            canvas.toBlob((pngBlob) => {
                if (!pngBlob) {
                    return;
                }

                const pngUrl = URL.createObjectURL(pngBlob);

                const link = document.createElement("a");

                link.href = pngUrl;
                link.download = `${token}-qr.png`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(pngUrl);
            }, "image/png");
        };

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
                    p: 0,
                    backgroundColor: "#fff",
                    borderRadius: 2,
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
                    color: "text.secondary",
                    fontSize: 12,
                    wordBreak: "break-all",
                }}
            >
                {feedbackUrl}
            </Typography>

            <Stack
                sx={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                    mb: 2,
                }}
            >
                <Button
                    variant="contained"
                    size="small"
                    onClick={downloadPng}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    Tải PNG
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={downloadSvg}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    Tải SVG
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={handlePrint}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    In QR
                </Button>
            </Stack>
        </>
    );
}
