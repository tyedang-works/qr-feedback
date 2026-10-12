import type { SxProps, Theme } from "@mui/material/styles";

export const formLabelSx: SxProps<Theme> = {
    display: "block",
    mb: 0.75,
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 600,
    color: "#1A202E",
};

export const formErrorSx: SxProps<Theme> = {
    position: "absolute",
    top: "calc(100% + 6px)",
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
};

export const checkboxStyleSx: SxProps<Theme> = {
    width: 32,
    height: 32,
    p: 0.5,
    m: 0,
    flexShrink: 0,
    borderRadius: 1,
    color: "#98A2B3",

    "& .MuiSvgIcon-root": {
        fontSize: 20,
    },

    "&:hover": {
        backgroundColor: "rgba(25, 59, 86, 0.06)",
    },

    "&.Mui-checked, &.MuiCheckbox-indeterminate": {
        color: "#1976D2",
    },

    "& .MuiTouchRipple-root": {
        display: "none",
    },
};
