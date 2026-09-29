"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

import { APP_URL } from "@/lib/config/app";

type QRCodeBulkPrintTable = {
    id: string;
    name: string;
    token: string;
};

type QRCodeBulkPrintViewProps = {
    tables: QRCodeBulkPrintTable[];
    onClose: () => void;
};

export default function QRCodeBulkPrintView({
    tables,
    onClose,
}: QRCodeBulkPrintViewProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Box
            className="qr-page"
            sx={{
                width: "100%",
                minHeight: "100vh",
                boxSizing: "border-box",
                backgroundColor: "#f2f4f7",
                py: 4,
                px: 2,
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                    maxWidth: 1200,
                    mx: "auto",
                    gap: 3,
                }}
            >
                {/* Actions */}
                <Stack
                    sx={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        In mã QR
                    </Typography>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            gap: 1,
                        }}
                    >
                        <Button
                            type="button"
                            onClick={onClose}
                            sx={{
                                height: 38,
                                px: 1.5,
                                borderRadius: 1.5,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#344054",
                                backgroundColor: "#ffffff",
                                border: "1px solid #d0d5dd",
                                textTransform: "none",

                                "&:hover": {
                                    backgroundColor: "#f9fafb",
                                },
                            }}
                        >
                            Quay lại
                        </Button>

                        <Button
                            type="button"
                            onClick={handlePrint}
                            variant="contained"
                            sx={{
                                height: 38,
                                px: 1.5,
                                borderRadius: 1.5,
                                fontSize: 13,
                                fontWeight: 600,
                                backgroundColor: "#193B56",
                                textTransform: "none",

                                "&:hover": {
                                    backgroundColor: "#142F45",
                                },
                            }}
                        >
                            In {tables.length} QR
                        </Button>
                    </Stack>
                </Stack>

                {/* QR grid */}
                <Box
                    className="qr-print-area"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 2,

                        "@media print": {
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 2,
                        },
                    }}
                >
                    {tables.map((table) => {
                        const qrUrl = `${APP_URL}/s/${table.token}`;

                        return (
                            <Box
                                key={table.id}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 0,
                                    minHeight: 320,
                                    p: 3,
                                    border: "1px solid #eaecf0",
                                    borderRadius: 2,
                                    backgroundColor: "#ffffff",
                                    boxSizing: "border-box",
                                    breakInside: "avoid",
                                    pageBreakInside: "avoid",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        lineHeight: 1.4,
                                        fontWeight: 700,
                                        color: "#193B56",
                                        textAlign: "center",
                                    }}
                                >
                                    QR Feedback
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 20,
                                        lineHeight: 1.4,
                                        fontWeight: 700,
                                        color: "#1A202E",
                                        textAlign: "center",
                                    }}
                                >
                                    {table.name}
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
                                        size={180}
                                        level="M"
                                        marginSize={4}
                                    />
                                </Box>

                                <Typography
                                    className="qr-print-note"
                                    sx={{
                                        mt: 1,
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        fontWeight: 500,
                                        color: "#344054",
                                        textAlign: "center",
                                    }}
                                >
                                    Quét mã để gửi phản hồi
                                </Typography>

                                <Typography
                                    className="qr-print-url"
                                    sx={{
                                        mt: 0.75,
                                        fontSize: 10,
                                        lineHeight: 1.4,
                                        color: "#98a2b3",
                                        textAlign: "center",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {qrUrl}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Stack>
        </Box>
    );
}
