import type { SxProps, Theme } from "@mui/material/styles";

export const buttonBaseSx: SxProps<Theme> = {
    minWidth: 100,
    height: 40,
    borderRadius: 1,
    backgroundColor: "var(--color-primary)",
    color: "var(--color-background)",
    fontSize: 14,
    fontWeight: 400,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "var(--color-text-secondary)",
        boxShadow: "none",
    },
};

export const buttonBaseCancelSx: SxProps<Theme> = {
    minWidth: 88,
    minHeight: 40,
    borderColor: "var(--color-border)",
    color: "var(--color-text-primary)",
    textTransform: "none",
    borderRadius: 1,
    "&:hover": {
        borderColor: "var(--color-text-muted)",
        backgroundColor: "var(--color-surface-hover)",
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
