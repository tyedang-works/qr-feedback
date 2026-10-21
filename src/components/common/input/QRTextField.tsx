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
                            backgroundColor: "#ffffff",

                            ...(multiline && {
                                padding: 0,
                            }),

                            "& fieldset": {
                                borderColor: "#d0d5dd",
                            },

                            "&:hover fieldset": {
                                borderColor: "#98a2b3",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#193B56",
                                borderWidth: 1,
                            },

                            "&.Mui-error fieldset": {
                                borderColor: "#d92d20",
                            },

                            "&.Mui-error.Mui-focused fieldset": {
                                borderColor: "#d92d20",
                            },
                        },

                        "& .MuiOutlinedInput-input": {
                            boxSizing: "border-box",
                            height: "42px",
                            padding: "10px 12px",
                            fontSize: 14,
                            lineHeight: 1,
                            color: "#344054",
                        },

                        "& .MuiOutlinedInput-inputMultiline": {
                            boxSizing: "border-box",
                            height: "auto",
                            minHeight: "unset",
                            padding: "8px 10px",
                            fontSize: 13,
                            lineHeight: 1.5,
                            color: "#344054",
                            resize: "vertical",
                        },

                        "& .MuiInputBase-input::placeholder": {
                            color: "#98a2b3",
                            opacity: 1,
                        },

                        "& input::-ms-reveal, & input::-ms-clear": {
                            display: "none",
                        },
                        "& input::-webkit-credentials-auto-fill-button": {
                            visibility: "hidden",
                            display: "none !important",
                            pointerEvents: "none",
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
