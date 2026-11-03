import { Box } from "@mui/material";
import { Trash2 } from "lucide-react";

type ClearFiltersButtonProps = {
    onClick: () => void;
    label: string;
    variant?: "text" | "outlined";
};

export default function ClearFiltersButton({
    onClick,
    label,
    variant = "text",
}: ClearFiltersButtonProps) {
    return (
        <Box
            component="button"
            type="button"
            onClick={onClick}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                px: variant === "outlined" ? 1.5 : 1,
                py: 0.75,
                border:
                    variant === "outlined"
                        ? "1px solid var(--color-border)"
                        : 0,
                borderRadius: 1.5,
                bgcolor: "transparent",
                color:
                    variant === "outlined"
                        ? "var(--color-text-primary)"
                        : "var(--color-table-delete, #D92D20)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition:
                    "background-color 150ms ease, border-color 150ms ease",
                "&:hover": {
                    bgcolor:
                        variant === "outlined"
                            ? "var(--color-surface-hover)"
                            : "var(--bg-table-delete-hover)",
                },
                "&:focus-visible": {
                    outline: "2px solid var(--color-input-focus)",
                    outlineOffset: 2,
                },
            }}
        >
            <Trash2 size={15} />
            {label}
        </Box>
    );
}
