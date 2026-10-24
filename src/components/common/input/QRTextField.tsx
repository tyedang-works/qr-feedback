import type { TextFieldProps } from "@mui/material";
import { Box, TextField, Typography } from "@mui/material";

import { formErrorSx, formLabelSx, formRequiredSx } from "@/styles/form.styles";

type QRTextFieldProps = Omit<
    TextFieldProps,
    "error" | "helperText" | "label"
> & {
    label?: string;
    errorMessage?: string;
    required?: boolean;
};

export default function QRTextField({
    label,
    errorMessage,
    required = false,
    multiline = false,
    sx,
    ...props
}: QRTextFieldProps) {
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

            <TextField
                {...props}
                fullWidth
                multiline={multiline}
                label={undefined}
                error={hasError}
                sx={[
                    {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: multiline ? 2 : 1,
                            backgroundColor:
                                "var(--color-input-background, var(--color-surface, #FFFFFF))",
                            color: "var(--color-text-primary, #111827)",
                            transition:
                                "background-color 150ms ease, border-color 150ms ease",

                            ...(multiline && {
                                padding: 0,
                            }),

                            "& fieldset": {
                                borderColor:
                                    "var(--color-input-border, var(--color-border, #D0D5DD))",
                            },

                            "&:hover fieldset": {
                                borderColor:
                                    "var(--color-input-border-hover, #98A2B3)",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor:
                                    "var(--color-input-focus, #193B56)",
                                borderWidth: 1,
                            },

                            "&.Mui-error fieldset": {
                                borderColor: "#D92D20",
                            },

                            "&.Mui-error.Mui-focused fieldset": {
                                borderColor: "#D92D20",
                            },

                            "&.Mui-disabled": {
                                backgroundColor:
                                    "var(--color-surface-hover, #F9FAFB)",
                            },
                            "& textarea::placeholder": {
                                fontSize: "13px",
                                opacity: 0.5,
                                fontFamily: "var(--font-momo-trust-sans)",
                                color: "var(--color-text-muted, #98A2B3)",
                            },
                        },

                        "& .MuiOutlinedInput-input": {
                            boxSizing: "border-box",
                            height: "42px",
                            padding: "10px 12px",
                            fontSize: 13,
                            lineHeight: 1.4,
                            color: "var(--color-text-primary, #111827)",
                            WebkitTextFillColor:
                                "var(--color-text-primary, #111827)",
                            fontFamily: "var(--font-momo-trust-sans)",
                        },

                        "& .MuiOutlinedInput-inputMultiline": {
                            boxSizing: "border-box",
                            height: "auto",
                            minHeight: "unset",
                            padding: "8px 10px",
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: "var(--color-text-primary, #111827)",
                            resize: "vertical",
                        },

                        "& .MuiInputBase-input::placeholder": {
                            color: "var(--color-text-muted, #98A2B3)",
                            opacity: 0.5,
                            fontSize: "13px",
                        },

                        "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor:
                                "var(--color-text-muted, #98A2B3)",
                        },

                        "& input::-ms-reveal, & input::-ms-clear": {
                            display: "none",
                        },

                        "& input::-webkit-credentials-auto-fill-button": {
                            visibility: "hidden",
                            display: "none !important",
                            pointerEvents: "none",
                        },
                        "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & textarea:-webkit-autofill, & textarea:-webkit-autofill:hover, & textarea:-webkit-autofill:focus":
                            {
                                WebkitBoxShadow:
                                    "0 0 0 1000px var(--color-surface, #FFFFFF) inset",
                                WebkitTextFillColor:
                                    "var(--color-text-primary, #111827)",
                                caretColor:
                                    "var(--color-text-primary, #111827)",
                                transition:
                                    "background-color 9999s ease-out 0s",
                            },
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            />

            {errorMessage && (
                <Typography component="p" sx={formErrorSx}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
}
