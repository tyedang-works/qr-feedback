import type { SxProps, Theme } from "@mui/material/styles";

export const formLabelSx: SxProps<Theme> = {
    display: "block",
    mb: 0.75,
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 500,
    color: "var(--color-text-secondary, #667085)",
};

export const formErrorSx: SxProps<Theme> = {
    position: "absolute",
    top: "calc(100% + 2px)",
    left: 0,
    mt: 0,
    mb: 0,
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: 400,
    color: "error.main",
};

export const formRequiredSx = {
    ml: 0.25,
    color: "error.main",
    fontSize: 13,
};

export const checkboxStyleSx: SxProps<Theme> = {
    width: 32,
    height: 32,
    p: 0.5,
    m: 0,
    flexShrink: 0,
    borderRadius: 1,

    color: "var(--color-text-muted)",

    "& .MuiSvgIcon-root": {
        fontSize: 20,
    },

    "&:hover": {
        backgroundColor: "var(--bg-table-edit-hover)",
    },

    "&.Mui-checked, &.MuiCheckbox-indeterminate": {
        color: "var(--color-table-edit)",
    },

    "&.Mui-disabled": {
        color: "var(--color-text-muted)",
        opacity: 0.5,
    },

    "& .MuiTouchRipple-root": {
        display: "none",
    },
};
