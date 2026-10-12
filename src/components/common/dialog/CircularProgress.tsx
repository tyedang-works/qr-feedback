"use client";

import {
    Dialog,
    DialogContent,
    CircularProgress as MuiCircularProgress,
    Stack,
    Typography,
} from "@mui/material";

export type CircularProgressProps = {
    open: boolean;
    message?: string;
    size?: number;
    fullScreen?: boolean;
};

export default function CircularProgress({
    open,
    message = "Đang tải dữ liệu...",
    size = 36,
    fullScreen = false,
}: CircularProgressProps) {
    return (
        <Dialog
            open={open}
            fullScreen={fullScreen}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: { xs: 240, sm: 280 },
                        borderRadius: fullScreen ? 0 : 2.5,
                        boxShadow: "0 16px 48px rgba(16, 24, 40, 0.16)",
                    },
                },
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(16, 24, 40, 0.32)",
                    },
                },
            }}
            aria-labelledby="circular-progress-dialog-title"
        >
            <DialogContent
                sx={{
                    px: 3,
                    py: 4,
                }}
            >
                <Stack
                    spacing={2}
                    sx={{ alignItems: "center", justifyContent: "center" }}
                >
                    <MuiCircularProgress
                        size={size}
                        thickness={4}
                        sx={{
                            color: "#193B56",
                        }}
                        aria-label={message}
                    />

                    {message && (
                        <Typography
                            id="circular-progress-dialog-title"
                            sx={{
                                color: "#475467",
                                fontSize: 14,
                                fontWeight: 500,
                                textAlign: "center",
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
