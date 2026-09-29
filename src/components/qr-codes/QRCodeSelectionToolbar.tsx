"use client";

import { Box, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";

type QRCodeSelectionToolbarProps = {
    selectedCount: number;
    onPrint: () => void;
    onClear: () => void;
};

export default function QRCodeSelectionToolbar({
    selectedCount,
    onPrint,
    onClear,
}: QRCodeSelectionToolbarProps) {
    if (selectedCount <= 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                minHeight: 52,
                px: 2,
                border: "1px solid #d0d5dd",
                borderRadius: 2,
                backgroundColor: "#f9fafb",
            }}
        >
            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#344054",
                }}
            >
                ✓ {selectedCount} bàn đã chọn
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Button
                    type="button"
                    variant="contained"
                    onClick={onPrint}
                    startIcon={<FontAwesomeIcon icon={faPrint} />}
                    sx={{
                        minHeight: 36,
                        px: 1.5,
                        borderRadius: 1.5,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "none",
                        backgroundColor: "#193B56",

                        "&:hover": {
                            backgroundColor: "#142F45",
                        },
                    }}
                >
                    In QR ({selectedCount})
                </Button>

                <Box
                    component="button"
                    type="button"
                    onClick={onClear}
                    aria-label="Bỏ chọn"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        p: 0,
                        border: 0,
                        borderRadius: 1,
                        backgroundColor: "transparent",
                        color: "#667085",
                        cursor: "pointer",

                        "&:hover": {
                            backgroundColor: "#f2f4f7",
                            color: "#344054",
                        },
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </Box>
            </Box>
        </Box>
    );
}
