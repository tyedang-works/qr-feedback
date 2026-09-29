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
    ...props
}: QRSelectProps<Value>) {
    const hasError = Boolean(errorMessage);

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
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
                        borderRadius: 1,
                        backgroundColor: "#ffffff",

                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d0d5dd",
                        },

                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#98a2b3",
                        },

                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#193B56",
                            borderWidth: 1,
                        },

                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d92d20",
                        },

                        "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: "#d92d20",
                            },

                        "& .MuiSelect-select": {
                            minHeight: "unset",
                            boxSizing: "border-box",
                            px: 1.5,
                            py: 1.25,
                            fontSize: 14,
                            lineHeight: 1.5,
                            color: "#344054",
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
