import type { SxProps, Theme } from "@mui/material/styles";

export const cardSx: SxProps<Theme> = {
    height: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    p: { xs: 2, sm: 2.5 },
    border: "1px solid var(--color-border, #F0F2F5)",
    borderRadius: "16px",
    bgcolor: "var(--color-surface, #FFFFFF)",
    boxShadow: "var(--shadow-card)",
};
