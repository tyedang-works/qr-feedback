"use client";

import { forwardRef, type ReactNode } from "react";

import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    type DialogProps,
    type SlideProps,
} from "@mui/material";

import { X } from "lucide-react";

type QRDialogProps = Omit<DialogProps, "title" | "children"> & {
    title: string;
    children: ReactNode;
    actions?: ReactNode;
};

const DialogTransition = forwardRef<HTMLDivElement, SlideProps>(
    function DialogTransition(props, ref) {
        return (
            <Slide
                ref={ref}
                {...props}
                direction="up"
                timeout={{
                    enter: 300,
                    exit: 200,
                }}
            />
        );
    },
);

export default function QRDialog({
    open,
    onClose,
    title,
    children,
    actions,
    fullWidth = true,
    maxWidth = "xs",
    ...props
}: QRDialogProps) {
    return (
        <Dialog
            {...props}
            open={open}
            onClose={onClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            scroll="paper"
            slots={{
                transition: DialogTransition,
            }}
            slotProps={{
                paper: {
                    sx: {
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                        maxHeight: "calc(100% - 64px)",
                        overflow: "hidden",
                        borderRadius: 1.5,
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text-primary)",
                        border: "1px solid var(--color-border)",
                        backgroundImage: "none",

                        "@media (max-width: 599px)": {
                            maxHeight: "calc(100% - 32px)",
                            m: 2,
                        },
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 64,
                    flexShrink: 0,
                    px: 3,
                    py: 1.5,
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <Box
                    component="span"
                    sx={{
                        minWidth: 0,
                        fontSize: 18,
                        lineHeight: 1.5,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                    }}
                >
                    {title}
                </Box>

                <IconButton
                    type="button"
                    onClick={(event) => onClose?.(event, "escapeKeyDown")}
                    aria-label="Đóng"
                    size="small"
                    sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        color: "var(--color-text-secondary)",
                        borderRadius: 1,

                        "&:hover": {
                            backgroundColor: "var(--color-surface-hover)",
                            color: "var(--color-text-primary)",
                        },

                        "&:focus-visible": {
                            outline: "2px solid var(--color-input-focus)",
                            outlineOffset: 2,
                        },
                    }}
                >
                    <X size={16} />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    position: "relative",
                    flex: "1 1 auto",
                    minHeight: 0,
                    overflowX: "hidden",
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    px: 3,
                    py: 3,
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",

                    "&.MuiDialogContent-root": {
                        paddingTop: 2,
                    },

                    "&::-webkit-scrollbar": {
                        width: 6,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--color-text-muted)",
                        borderRadius: 999,
                    },

                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                    },
                }}
            >
                {children}
            </DialogContent>

            {actions && (
                <Box
                    sx={{
                        px: 3,
                        pb: 2.5,
                        pt: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1,
                        flexShrink: 0,
                        backgroundColor: "var(--color-surface)",
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    {actions}
                </Box>
            )}
        </Dialog>
    );
}
