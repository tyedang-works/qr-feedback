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
                        backgroundColor: "#ffffff",

                        display: "flex",
                        alignItems: "center",

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

                        "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            height: "42px",
                            minHeight: "0 !important",
                            boxSizing: "border-box",
                            padding: "0 36px 0 12px",
                            fontSize: 14,
                            lineHeight: "20px",
                        },

                        "& .MuiSelect-icon": {
                            top: "50%",
                            transform: "translateY(-50%)",
                        },
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                MenuProps={{
                    slotProps: {
                        paper: {
                            sx: {
                                mt: 0.5,
                                borderRadius: 1,
                                border: "1px solid #eaecf0",
                                boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",

                                "& .MuiMenuItem-root": {
                                    minHeight: 40,
                                    px: 1.5,
                                    py: 1,
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                    color: "#1A202E",
                                },

                                "& .MuiMenuItem-root:hover": {
                                    backgroundColor: "#f9fafb",
                                },

                                "& .MuiMenuItem-root.Mui-selected": {
                                    backgroundColor: "#f2f4f7",
                                },

                                "& .MuiMenuItem-root.Mui-selected:hover": {
                                    backgroundColor: "#eaecf0",
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
