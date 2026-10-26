import { Box, Select, Typography } from "@mui/material";
import type { SelectProps } from "@mui/material/Select";

import { formErrorSx, formLabelSx, formRequiredSx } from "@/styles/form.styles";

type QRSelectProps<Value> = Omit<SelectProps<Value>, "error" | "label"> & {
    label?: string;
    errorMessage?: string;
    required?: boolean;
};

export default function QRSelect<Value = string>({
    label,
    errorMessage,
    required = false,
    sx,
    MenuProps,
    ...props
}: QRSelectProps<Value>) {
    const hasError = Boolean(errorMessage);

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
            }}
        >
            {label && (
                <Typography component="label" sx={formLabelSx}>
                    {label}

                    {required && (
                        <Typography component="span" sx={formRequiredSx}>
                            *
                        </Typography>
                    )}
                </Typography>
            )}

            <Select<Value>
                {...props}
                fullWidth
                error={hasError}
                sx={[
                    {
                        height: 42,
                        minHeight: 42,
                        boxSizing: "border-box",
                        borderRadius: 1,
                        backgroundColor:
                            "var(--color-input-background, var(--color-surface, #FFFFFF))",
                        color: "var(--color-text-primary, #111827)",
                        display: "flex",
                        alignItems: "center",
                        transition:
                            "background-color 150ms ease, border-color 150ms ease",

                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                                "var(--color-input-border, var(--color-border, #D0D5DD))",
                        },

                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                                "var(--color-input-border-hover, #98A2B3)",
                        },

                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--color-input-focus, #193B56)",
                            borderWidth: 1,
                        },

                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#D92D20",
                        },

                        "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            height: "42px",
                            minHeight: "0 !important",
                            boxSizing: "border-box",
                            padding: "0 36px 0 12px",
                            fontSize: 13,
                            lineHeight: "20px",
                        },

                        "& .MuiSelect-icon": {
                            top: "50%",
                            right: 10,
                            transform: "translateY(-50%)",
                            color: "var(--color-text-secondary, #667085)",
                        },

                        "&.Mui-disabled": {
                            backgroundColor:
                                "var(--color-surface-hover, #F9FAFB)",
                            color: "var(--color-text-muted, #98A2B3)",
                        },
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}

                MenuProps={{
                    ...MenuProps,

                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                        ...MenuProps?.anchorOrigin,
                    },

                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                        ...MenuProps?.transformOrigin,
                    },

                    marginThreshold: 8,

                    slotProps: {
                        ...MenuProps?.slotProps,

                        paper: {
                            sx: {
                                mt: 0.5,
                                maxHeight: "min(280px, calc(100dvh - 32px))",
                                overflowY: "auto",
                                overscrollBehavior: "contain",

                                border: "1px solid var(--color-border, #EAECF0)",
                                borderRadius: 1.5,
                                bgcolor: "var(--color-surface, #FFFFFF)",
                                color: "var(--color-text-primary, #111827)",
                                boxShadow: "var(--shadow-card)",
                                backgroundImage: "none",

                                "& .MuiMenuItem-root": {
                                    minHeight: 40,
                                    px: 1.5,
                                    py: 1,
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                    color: "var(--color-text-primary, #111827)",
                                },

                                "& .MuiMenuItem-root:hover": {
                                    backgroundColor:
                                        "var(--color-surface-hover, #F9FAFB)",
                                },

                                "& .MuiMenuItem-root.Mui-selected": {
                                    backgroundColor:
                                        "var(--color-surface-active, #F2F4F7)",
                                },

                                "& .MuiMenuItem-root.Mui-selected:hover": {
                                    backgroundColor:
                                        "var(--color-surface-active, #EAECF0)",
                                },
                            },
                        },
                    },
                }}
            />

            {errorMessage && (
                <Typography component="p" sx={formErrorSx}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
}
