import type { SxProps, Theme } from "@mui/material/styles";

export const buttonBaseSx: SxProps<Theme> = {
    minWidth: 100,
    minHeight: 40,
    borderRadius: 1.5,
    backgroundColor: "var(--color-button-primary-bg)",
    color: "var(--color-button-primary-text)",
    fontSize: 14,
    fontWeight: 500,
    textTransform: "none",
    boxShadow: "none",
    transition:
        "background-color 150ms ease, border-color 150ms ease, color 150ms ease",

    "&:hover": {
        backgroundColor: "var(--color-button-primary-hover)",
        boxShadow: "none",
    },

    "&:active": {
        backgroundColor: "var(--color-button-primary-active)",
        boxShadow: "none",
    },

    "&.Mui-disabled": {
        backgroundColor: "var(--color-surface-active)",
        color: "var(--color-text-muted)",
        boxShadow: "none",
        opacity: 0.8,
    },
};

export const buttonBaseCancelSx: SxProps<Theme> = {
    minWidth: 88,
    minHeight: 40,
    border: "1px solid var(--color-border)",
    borderColor: "var(--color-border)",
    borderRadius: 1.5,
    backgroundColor: "transparent",
    color: "var(--color-text-secondary)",
    fontSize: 14,
    fontWeight: 500,
    textTransform: "none",
    boxShadow: "none",
    transition:
        "background-color 150ms ease, border-color 150ms ease, color 150ms ease",

    "&:hover": {
        borderColor: "var(--color-input-border-hover)",
        backgroundColor: "var(--color-surface-hover)",
        boxShadow: "none",
    },

    "&:active": {
        backgroundColor: "var(--color-surface-active)",
    },

    "&.Mui-disabled": {
        borderColor: "var(--color-border)",
        backgroundColor: "transparent",
        color: "var(--color-text-muted)",
        opacity: 0.65,
    },
};

export const chipBaseSx: SxProps<Theme> = {
    maxWidth: "100%",
    bgcolor: "var(--color-surface-active)",
    color: "var(--color-text-secondary)",
    fontSize: 12,
    borderRadius: "5px",
    "& .MuiChip-label": {
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
};

const tableActionButtonBaseSx: SxProps<Theme> = {
    height: "32px",
    px: 1,
    borderRadius: 1.5,
    fontSize: 13,
    fontWeight: 600,
    textTransform: "none",
};

export const tableEditButtonSx: SxProps<Theme> = {
    ...tableActionButtonBaseSx,
    minWidth: "86px",
    width: "86px",
    maxWidth: "86px",
    flexShrink: 0,
    color: "var(--color-table-edit)",

    "&:hover": {
        backgroundColor: "var(--bg-table-edit-hover)",
    },
};

export const tableDeleteButtonSx: SxProps<Theme> = {
    ...tableActionButtonBaseSx,
    minWidth: "50px",
    color: "var(--color-table-delete)",
    backgroundColor: "var(--bg-table-delete)",

    "&:hover": {
        backgroundColor: "var(--bg-table-delete-hover)",
    },
};

export const buttonBaseDeleteSx: SxProps<Theme> = {
    ...buttonBaseSx,
    backgroundColor: "var(--color-button-delete-bg)",
    color: "#ffffff",

    "&:hover": {
        backgroundColor: "var(--color-button-delete-hover)",
        boxShadow: "none",
    },
};
