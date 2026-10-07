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
                label={undefined}
                error={hasError}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "#ffffff",

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

                    "& .MuiInputBase-input": {
                        height: 22,
                        px: 1.5,
                        py: 1.25,
                        fontSize: 14,
                        color: "#344054",
                        lineHeight: 1,
                    },

                    "& .MuiInputBase-input::placeholder": {
                        color: "#98a2b3",
                        opacity: 1,
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
