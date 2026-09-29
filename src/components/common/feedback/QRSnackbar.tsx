"use client";

import { forwardRef } from "react";

import { Alert, Slide, Snackbar, type SlideProps } from "@mui/material";

type QRSnackbarSeverity = "success" | "error" | "warning" | "info";

type QRSnackbarProps = {
    open: boolean;
    message: string;
    severity?: QRSnackbarSeverity;
    onClose: () => void;
    autoHideDuration?: number;
};

const SnackbarTransition = forwardRef<HTMLDivElement, SlideProps>(
    function SnackbarTransition(props, ref) {
        return (
            <Slide
                {...props}
                ref={ref}
                direction="right"
                timeout={{
                    enter: 350,
                    exit: 250,
                }}
            />
        );
    },
);

export default function QRSnackbar({
    open,
    message,
    severity = "success",
    onClose,
    autoHideDuration = 3000,
}: QRSnackbarProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            slots={{
                transition: SnackbarTransition,
            }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{
                    minWidth: 280,
                    maxWidth: 420,
                    fontSize: 14,
                    borderRadius: 1.5,
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
