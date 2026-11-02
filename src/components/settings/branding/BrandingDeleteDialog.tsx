"use client";

import { Button, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";

import QRDialog from "@/components/common/dialog/QRDialog";
import { useTranslation } from "@/components/common/providers/useTranslation";
import { buttonBaseCancelSx, buttonBaseSx } from "@/styles/button.styles";

type Props = {
    open: boolean;
    title: string;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function BrandingDeleteDialog({
    open,
    title,
    loading,
    onClose,
    onConfirm,
}: Props) {
    const { t } = useTranslation();

    return (
        <QRDialog
            open={open}
            onClose={onClose}
            title={t("settings", "deleteImageTitle")}
            maxWidth="xs"
            actions={
                <>
                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={onClose}
                        sx={buttonBaseCancelSx}
                    >
                        {t("settings", "cancel")}
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        disabled={loading}
                        onClick={onConfirm}
                        startIcon={<Trash2 size={15} />}
                        sx={{
                            ...buttonBaseSx,
                            bgcolor: "error.main",
                            "&:hover": { bgcolor: "error.dark" },
                        }}
                    >
                        {t("settings", "confirm")}
                    </Button>
                </>
            }
        >
            <Typography
                sx={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--color-text-secondary)",
                }}
            >
                {t("settings", "deleteImageDescription").replace(
                    "{title}",
                    title,
                )}
            </Typography>
        </QRDialog>
    );
}
