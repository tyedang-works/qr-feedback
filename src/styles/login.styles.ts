import type { SxProps, Theme } from "@mui/material";

const LOGIN_COLORS = {
    text: "#111827",
    textSecondary: "#6b7280",
    placeholder: "#98A2B3",
    border: "#d0d5dd",
    borderHover: "#98a2b3",
    focus: "#193b56",
    background: "#ffffff",
    primary: "#111827",
    primaryHover: "#454F5B",
    primaryActive: "#16344b",
    disabled: "#f9fafb",
    error: "#d92d20",
} as const;

export const loginTextFieldSx: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: LOGIN_COLORS.background,
        color: LOGIN_COLORS.text,

        "& fieldset": {
            borderColor: LOGIN_COLORS.border,
        },

        "&:hover fieldset": {
            borderColor: LOGIN_COLORS.borderHover,
        },

        "&.Mui-focused fieldset": {
            borderColor: LOGIN_COLORS.focus,
            borderWidth: 1,
        },

        "&.Mui-error fieldset, &.Mui-error.Mui-focused fieldset": {
            borderColor: LOGIN_COLORS.error,
        },

        "&.Mui-disabled": {
            backgroundColor: LOGIN_COLORS.disabled,
        },
    },

    "& .MuiOutlinedInput-input": {
        color: LOGIN_COLORS.text,
        WebkitTextFillColor: LOGIN_COLORS.text,

        "&::placeholder": {
            color: LOGIN_COLORS.placeholder,
            opacity: 0.5,
        },
    },

    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: LOGIN_COLORS.placeholder,
    },

    "& .MuiInputBase-input:-webkit-autofill, & .MuiInputBase-input:-webkit-autofill:hover, & .MuiInputBase-input:-webkit-autofill:focus":
        {
            WebkitBoxShadow: `0 0 0 1000px ${LOGIN_COLORS.background} inset`,
            WebkitTextFillColor: LOGIN_COLORS.text,
            caretColor: LOGIN_COLORS.text,
        },
};

export const loginButtonSx: SxProps<Theme> = {
    minHeight: 48,
    px: 2,
    borderRadius: "8px",
    backgroundColor: LOGIN_COLORS.primary,
    color: "#ffffff",
    boxShadow: "none",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 600,

    "&:hover": {
        backgroundColor: LOGIN_COLORS.primaryHover,
        boxShadow: "none",
    },

    "&:active": {
        backgroundColor: LOGIN_COLORS.primaryActive,
        boxShadow: "none",
    },

    "&.Mui-disabled": {
        backgroundColor: "#d1d5db",
        color: "#ffffff",
    },
};
