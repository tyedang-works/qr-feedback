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
            slots={{
                transition: DialogTransition,
            }}
            slotProps={{
                paper: {
                    sx: {
                        overflow: "hidden",
                        borderRadius: 1.5,
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
                    px: 3,
                    py: 1.5,
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #eaecf0",
                }}
            >
                <Box
                    component="span"
                    sx={{
                        fontSize: 18,
                        lineHeight: 1.5,
                        fontWeight: 700,
                        color: "#193B56",
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
                        color: "#667085",
                        borderRadius: 1,

                        "&:hover": {
                            backgroundColor: "#f2f4f7",
                            color: "#344054",
                        },
                    }}
                >
                    <X size={16} />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    position: "relative",
                    overflow: "visible",

                    px: 3,
                    py: 3,

                    "&.MuiDialogContent-root": {
                        paddingTop: 2,
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
                        backgroundColor: "#ffffff",
                    }}
                >
                    {actions}
                </Box>
            )}
        </Dialog>
    );
}
