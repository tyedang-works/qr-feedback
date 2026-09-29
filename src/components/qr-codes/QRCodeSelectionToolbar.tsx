"use client";

import { Box, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";

type QRCodeSelectionToolbarProps = {
    selectedCount: number;
    selectableTotal: number;
    showSelectAll: boolean;
    onSelectAll: () => void;
    onPrint: () => void;
    onClear: () => void;
};

export default function QRCodeSelectionToolbar({
    selectedCount,
    selectableTotal,
    showSelectAll,
    onSelectAll,
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
                py: 1,
                border: "1px solid #d0d5dd",
                borderRadius: 2,
                backgroundColor: "#f9fafb",

                /*
                 * Desktop
                 */
                flexDirection: "row",

                /*
                 * Mobile
                 */
                "@media (max-width: 767px)": {
                    alignItems: "stretch",
                    flexDirection: "column",
                    gap: 1,
                    px: 1.5,
                    py: 1.25,
                },
            }}
        >
            {/* Selection information */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,

                    "@media (max-width: 767px)": {
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                        width: "100%",
                    },
                }}
            >
                <Typography
                    sx={{
                        flexShrink: 0,
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#344054",
                    }}
                >
                    ✓ {selectedCount} bàn đã chọn
                </Typography>

                {showSelectAll && selectableTotal > selectedCount && (
                    <Button
                        type="button"
                        variant="text"
                        onClick={onSelectAll}
                        sx={{
                            minWidth: 0,
                            p: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            lineHeight: 1.5,
                            textTransform: "none",
                            justifyContent: "flex-start",
                            textAlign: "left",
                            whiteSpace: "normal",
                            color: "#1976d2",

                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                            },

                            "@media (max-width: 767px)": {
                                width: "100%",
                                display: "block",
                            },
                        }}
                    >
                        Chọn tất cả {selectableTotal} bàn phù hợp với bộ lọc
                    </Button>
                )}
            </Box>

            {/* Actions */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1,
                    flexShrink: 0,

                    "@media (max-width: 767px)": {
                        width: "100%",
                        justifyContent: "flex-end",
                    },
                }}
            >
                <Button
                    type="button"
                    variant="contained"
                    startIcon={<FontAwesomeIcon icon={faPrint} />}
                    onClick={onPrint}
                    sx={{
                        minHeight: 36,
                        px: 1.75,
                        textTransform: "none",
                        whiteSpace: "nowrap",
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
                        flexShrink: 0,
                        width: 32,
                        height: 32,
                        p: 0,
                        border: 0,
                        borderRadius: 1,
                        backgroundColor: "transparent",
                        color: "#667085",
                        cursor: "pointer",

                        "&:hover": {
                            backgroundColor: "#eaecf0",
                        },
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </Box>
            </Box>
        </Box>
    );
}
