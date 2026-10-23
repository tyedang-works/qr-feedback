"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

import { APP_URL } from "@/lib/config/app";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";

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
                backgroundColor: "var(--color-background)",
                py: 4,
                px: 2,
                overflow: "hidden",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                }}
            >
                <Box
                    className="qr-print-area"
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        px: 4,
                        py: 5,
                        border: "1px solid var(--color-border)",
                        borderRadius: 2,
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-card)",
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
                        QR Feedback
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 20,
                            lineHeight: 1.5,
                            fontWeight: 700,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {tableName}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                        }}
                    >
                        <QRCodeSVG
                            value={qrUrl}
                            size={260}
                            level="M"
                            marginSize={4}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                        />
                    </Box>

                    <Typography
                        className="qr-print-note"
                        sx={{
                            mt: 1,
                            fontSize: 14,
                            lineHeight: 1.5,
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
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
                            color: "var(--color-text-muted)",
                            wordBreak: "break-all",
                        }}
                    >
                        {qrUrl}
                    </Typography>
                </Box>

                <Stack
                    sx={{
                        flexDirection: "row",
                        gap: 1,
                    }}
                >
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={onClose}
                        sx={buttonBaseCancelSx}
                    >
                        Quay lại
                    </Button>

                    <Button
                        type="button"
                        variant="contained"
                        onClick={handlePrint}
                        sx={buttonBaseSx}
                    >
                        In QR
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
