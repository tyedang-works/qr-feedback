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
