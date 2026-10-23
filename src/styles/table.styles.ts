import type { SxProps, Theme } from "@mui/material/styles";

export const tableStatusSwitchSx: SxProps<Theme> = (theme) => {
    const isDark = theme.palette.mode === "dark";

    return {
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
                    backgroundColor: isDark
                        ? "var(--color-status-success, #426b57)"
                        : "var(--color-status-success, #039855)",
                    opacity: 1,
                    border: 0,
                },

                "& .MuiSwitch-thumb": {
                    backgroundColor: "#ffffff",
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
            backgroundColor: isDark ? "#47484b" : "#D1D5DB",
            opacity: 1,
            transition: "background-color 200ms ease",
        },

        "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#ffffff",
        },
    };
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
