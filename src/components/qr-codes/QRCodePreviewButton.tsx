"use client";

import { Button } from "@mui/material";
import { useTranslation } from "../common/providers/useTranslation";

type QRCodePreviewButtonProps = {
    onClick: () => void;
};

export default function QRCodePreviewButton({
    onClick,
}: QRCodePreviewButtonProps) {
    const { t } = useTranslation();
    return (
        <Button
            type="button"
            onClick={onClick}
            sx={{
                minWidth: "auto",
                height: 36,
                px: 1,
                borderRadius: 1.5,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-table-edit)",
                textTransform: "none",
                backgroundColor: "transparent",

                "&:hover": {
                    backgroundColor: "var(--bg-table-edit-hover)",
                },
            }}
        >
            {t("qrCode", "previewQR")}
        </Button>
    );
}
