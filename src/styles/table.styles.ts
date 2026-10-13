import type { SxProps, Theme } from "@mui/material/styles";

export const tableStatusSwitchSx: SxProps<Theme> = {
    width: 38,
    height: 22,
    padding: 0,

    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: "2px",
        transitionDuration: "200ms",

        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#ffffff",

            "& + .MuiSwitch-track": {
                backgroundColor: "#34C759",
                opacity: 1,
                border: 0,
            },
        },

        "&.Mui-disabled": {
            opacity: 0.5,
        },
    },

    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 18,
        height: 18,
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
    },

    "& .MuiSwitch-track": {
        borderRadius: "11px",
        backgroundColor: "#D1D5DB",
        opacity: 1,
        transition: "background-color 200ms ease",
    },
};

export const getTableStatusLabelSx = (isActive: boolean): SxProps<Theme> => ({
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: isActive ? "#027A48" : "#667085",
    whiteSpace: "nowrap",
});

export const tableColumnHeaderSx: SxProps<Theme> = {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1a202e",
};
