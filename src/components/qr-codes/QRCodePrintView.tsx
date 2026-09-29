"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

import { APP_URL } from "@/lib/config/app";

type QRCodePrintViewProps = {
    tableName: string;
    tableToken: string;
    onClose: () => void;
};

export default function QRCodePrintView({
    tableName,
    tableToken,
    onClose,
}: QRCodePrintViewProps) {
    const qrUrl = `${APP_URL}/s/${tableToken}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box
            className="qr-page"
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                boxSizing: "border-box",
                backgroundColor: "#f2f4f7",
                py: 4,
                px: 2,
                overflow: "hidden",
            }}
        >
            <Stack
                spacing={3}
                sx={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    className="qr-print-area"
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        px: 4,
                        py: 5,
                        border: "1px solid #eaecf0",
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        boxShadow:
                            "0 1px 3px rgba(16, 24, 40, 0.08)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            lineHeight: 1.5,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        QR Feedback
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 20,
                            lineHeight: 1.5,
                            fontWeight: 700,
                            color: "#1A202E",
                        }}
                    >
                        {tableName}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 3,
                        }}
                    >
                        <QRCodeSVG
                            value={qrUrl}
                            size={260}
                            level="M"
                            marginSize={4}
                        />
                    </Box>

                    <Typography
                        className="qr-print-note"
                        sx={{
                            mt: 3,
                            fontSize: 14,
                            lineHeight: 1.5,
                            fontWeight: 500,
                            color: "#344054",
                        }}
                    >
                        Quét mã để gửi phản hồi
                    </Typography>

                    <Typography
                        className="qr-print-url"
                        sx={{
                            mt: 1,
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: "#98A2B3",
                            wordBreak: "break-all",
                        }}
                    >
                        {qrUrl}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Button
                        type="button"
                        onClick={onClose}
                        sx={{
                            minWidth: 80,
                            height: 38,
                            px: 1.5,
                            borderRadius: 1.5,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#344054",
                            backgroundColor: "#ffffff",
                            textTransform: "none",
                            border: "1px solid #D0D5DD",

                            "&:hover": {
                                backgroundColor: "#F9FAFB",
                            },
                        }}
                    >
                        Quay lại
                    </Button>

                    <Button
                        type="button"
                        onClick={handlePrint}
                        sx={{
                            minWidth: 80,
                            height: 38,
                            px: 1.5,
                            borderRadius: 1.5,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#ffffff",
                            backgroundColor: "#193B56",
                            textTransform: "none",

                            "&:hover": {
                                backgroundColor: "#142F45",
                            },
                        }}
                    >
                        In QR
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}