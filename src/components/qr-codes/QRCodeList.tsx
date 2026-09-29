"use client";

import {
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import type { QRCodeTable } from "@/lib/qr-codes/types";
import { useState } from "react";
import QRCodePreviewButton from "./QRCodePreviewButton";
import QRCodePreviewDialog from "./QRCodePreviewDialog";
import QRCodePrintView from "./QRCodePrintView";

type QRCodeListProps = {
    data: QRCodeTable[];
};

function getStatusStyles(isActive: boolean) {
    if (isActive) {
        return {
            color: "#027A48",
            backgroundColor: "#ECFDF3",
            label: "Đang hoạt động",
        };
    }

    return {
        color: "#667085",
        backgroundColor: "#F2F4F7",
        label: "Đã tắt",
    };
}

export default function QRCodeList({ data }: QRCodeListProps) {
    const [selectedTable, setSelectedTable] = useState<QRCodeTable | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
    };

    const handleClosePrint = () => {
        setIsPrinting(false);
    };

    if (isPrinting && selectedTable) {
        return (
            <QRCodePrintView
                tableName={selectedTable.name}
                tableToken={selectedTable.token}
                onClose={handleClosePrint}
            />
        );
    }

    return (
        <Stack
            spacing={3}
            sx={{
                width: "100%",
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: {
                            xs: 22,
                            sm: 24,
                        },
                        lineHeight: 1.4,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    QR Codes
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "#667085",
                    }}
                >
                    Quản lý mã QR cho từng bàn
                </Typography>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    border: "1px solid #eaecf0",
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                }}
            >
                {/* Desktop */}
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "1.5fr 1.5fr 1fr 120px",
                            alignItems: "center",
                            minHeight: 48,
                            px: 3,
                            backgroundColor: "#f9fafb",
                            borderBottom:
                                "1px solid #eaecf0",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#667085",
                            }}
                        >
                            Bàn
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#667085",
                            }}
                        >
                            Mã QR
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#667085",
                            }}
                        >
                            Trạng thái hoạt động
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#667085",
                                textAlign: "right",
                            }}
                        >
                            Thao tác
                        </Typography>
                    </Box>

                    {data.length === 0 ? (
                        <Box
                            sx={{
                                px: 3,
                                py: 6,
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: "#667085",
                                }}
                            >
                                Chưa có bàn nào.
                            </Typography>
                        </Box>
                    ) : (
                        data.map((table, index) => {
                            const status =
                                getStatusStyles(
                                    table.isActive,
                                );

                            return (
                                <Box
                                    key={table.id}
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1.5fr 1.5fr 1fr 120px",
                                        alignItems:
                                            "center",
                                        minHeight: 72,
                                        px: 3,
                                        borderBottom:
                                            index <
                                                data.length - 1
                                                ? "1px solid #eaecf0"
                                                : "none",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#1A202E",
                                        }}
                                    >
                                        {table.name}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#667085",
                                            overflow:
                                                "hidden",
                                            textOverflow:
                                                "ellipsis",
                                            whiteSpace:
                                                "nowrap",
                                            pr: 2,
                                        }}
                                    >
                                        {table.token}
                                    </Typography>

                                    <Box>
                                        <Box
                                            component="span"
                                            sx={{
                                                display:
                                                    "inline-flex",
                                                alignItems:
                                                    "center",
                                                px: 1.25,
                                                py: 0.5,
                                                borderRadius:
                                                    10,
                                                backgroundColor:
                                                    status.backgroundColor,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    lineHeight:
                                                        1.5,
                                                    fontWeight:
                                                        500,
                                                    color: status.color,
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {status.label}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <QRCodePreviewButton onClick={() => setSelectedTable(table)} />
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </Box>

                {/* Mobile */}
                <Box
                    sx={{
                        display: {
                            xs: "block",
                            md: "none",
                        },
                    }}
                >
                    {data.length === 0 ? (
                        <Box
                            sx={{
                                px: 2,
                                py: 6,
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: "#667085",
                                }}
                            >
                                Chưa có bàn nào.
                            </Typography>
                        </Box>
                    ) : (
                        data.map((table, index) => {
                            const status =
                                getStatusStyles(
                                    table.isActive,
                                );

                            return (
                                <Box key={table.id}>
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 2,
                                        }}
                                    >
                                        <Stack
                                            spacing={1.5}
                                        >
                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 14,
                                                        fontWeight:
                                                            600,
                                                        color: "#1A202E",
                                                    }}
                                                >
                                                    {
                                                        table.name
                                                    }
                                                </Typography>

                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display:
                                                            "inline-flex",
                                                        alignItems:
                                                            "center",
                                                        flexShrink: 0,
                                                        px: 1.25,
                                                        py: 0.5,
                                                        borderRadius:
                                                            10,
                                                        backgroundColor:
                                                            status.backgroundColor,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 11,
                                                            lineHeight:
                                                                1.5,
                                                            fontWeight:
                                                                500,
                                                            color: status.color,
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box>
                                                <Typography
                                                    sx={{
                                                        mb: 0.5,
                                                        fontSize: 11,
                                                        lineHeight:
                                                            1.5,
                                                        color: "#98A2B3",
                                                    }}
                                                >
                                                    Mã QR
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        color: "#667085",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {
                                                        table.token
                                                    }
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                                <QRCodePreviewButton onClick={() => setSelectedTable(table)} />
                                            </Box>
                                        </Stack>
                                    </Box>

                                    {index <
                                        data.length -
                                        1 && (
                                            <Divider />
                                        )}
                                </Box>
                            );
                        })
                    )}
                </Box>
            </Box>
            {selectedTable && (
                <QRCodePreviewDialog
                    open={Boolean(selectedTable)}
                    tableName={selectedTable.name}
                    tableToken={selectedTable.token}
                    onClose={() => setSelectedTable(null)}
                    onPrint={handlePrint}
                />
            )}
        </Stack>
    );
}