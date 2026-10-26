import type { SxProps, Theme } from "@mui/material/styles";

export const tableStatusSwitchSx: SxProps<Theme> = {
    width: 38,
    height: 22,
    padding: 0,
    overflow: "visible",

    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: "2px",
        transitionDuration: "200ms",

        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "var(--color-switch-thumb)",

            "& + .MuiSwitch-track": {
                backgroundColor: "var(--color-switch-track-checked)",
                opacity: 1,
                border: "1px solid var(--color-switch-track-checked-border)",
            },
        },

        "&.Mui-disabled": {
            opacity: 0.5,
        },

        "&.Mui-disabled.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "var(--color-switch-track-checked)",
            opacity: 0.5,
        },
    },

    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 18,
        height: 18,
        backgroundColor: "var(--color-switch-thumb)",
        boxShadow: "var(--shadow-switch-thumb)",
    },

    "& .MuiSwitch-track": {
        borderRadius: "11px",
        backgroundColor: "var(--color-switch-track)",
        border: "1px solid var(--color-switch-track-border)",
        opacity: 1,
        transition: "background-color 200ms ease, border-color 200ms ease",
    },

    "& .MuiSwitch-switchBase.Mui-disabled:not(.Mui-checked) + .MuiSwitch-track":
        {
            backgroundColor: "var(--color-switch-track-disabled)",
            borderColor: "var(--color-switch-track-disabled-border)",
            opacity: 1,
        },
};

export const getTableStatusLabelSx = (isActive: boolean): SxProps<Theme> => ({
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: isActive
        ? "var(--color-status-success, #426b57)"
        : "var(--color-text-secondary, #667085)",
    whiteSpace: "nowrap",
});

export const tableColumnHeaderSx: SxProps<Theme> = {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--color-table-header-text)",
};
