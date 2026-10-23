"use client";

import { APP_URL } from "@/lib/config/app";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";
import { Box, Button, Stack, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

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
                backgroundColor: "var(--color-background)",
                py: { xs: 2, md: 4 },
                px: { xs: 1.5, md: 2 },
                "@media print": {
                    minHeight: "auto",
                    p: 0,
                    backgroundColor: "#ffffff",
                },
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                    mx: "auto",
                    gap: 3,
                    "@media print": {
                        gap: 0,
                    },
                }}
            >
                <Stack
                    className="qr-print-toolbar"
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 2,
                        "@media print": {
                            display: "none",
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        In mã QR
                    </Typography>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
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
                            onClick={handlePrint}
                            variant="contained"
                            sx={buttonBaseSx}
                        >
                            In {tables.length} QR
                        </Button>
                    </Stack>
                </Stack>

                <Box
                    className="qr-print-area"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            sm: "repeat(2, minmax(0, 1fr))",
                            md: "repeat(3, minmax(0, 1fr))",
                            lg: "repeat(4, minmax(0, 1fr))",
                        },
                        gap: 2,
                        alignItems: "stretch",
                        "@media print": {
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: "6px",
                            alignItems: "start",
                        },
                    }}
                >
                    {tables.map((table) => {
                        const qrUrl = `${APP_URL}/s/${table.token}`;

                        return (
                            <Box
                                key={table.id}
                                className="qr-print-card"
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 0,
                                    minHeight: 320,
                                    p: { xs: 2, md: 3 },
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 2,
                                    backgroundColor: "var(--color-surface)",
                                    boxSizing: "border-box",
                                    breakInside: "avoid",
                                    pageBreakInside: "avoid",

                                    "@media print": {
                                        minHeight: 0,
                                        p: "8px 6px",
                                        border: "1px solid #eaecf0",
                                        borderRadius: "4px",
                                        backgroundColor: "#ffffff",
                                        justifyContent: "flex-start",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: 16, md: 18 },
                                        lineHeight: 1.4,
                                        fontWeight: 700,
                                        color: "var(--color-text-primary)",
                                        textAlign: "center",
                                        "@media print": {
                                            color: "#193b56",
                                        },
                                    }}
                                >
                                    QR Feedback
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: { xs: 18, md: 20 },
                                        lineHeight: 1.4,
                                        fontWeight: 700,
                                        color: "var(--color-text-primary)",
                                        textAlign: "center",
                                        overflowWrap: "anywhere",
                                        "@media print": {
                                            color: "#1a202e",
                                        },
                                    }}
                                >
                                    {table.name}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1.5,
                                        width: 180,
                                        height: 180,
                                        maxWidth: "100%",
                                        flexShrink: 0,
                                        "@media print": {
                                            width: 150,
                                            height: 150,
                                        },
                                    }}
                                >
                                    <QRCodeSVG
                                        value={qrUrl}
                                        size={180}
                                        level="M"
                                        marginSize={4}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    className="qr-print-note"
                                    sx={{
                                        mt: 1,
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        fontWeight: 500,
                                        color: "var(--color-text-secondary)",
                                        textAlign: "center",
                                        "@media print": {
                                            color: "#344054",
                                        },
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
                                        color: "var(--color-text-muted)",
                                        textAlign: "center",
                                        overflowWrap: "anywhere",
                                        "@media print": {
                                            color: "#98a2b3",
                                        },
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
