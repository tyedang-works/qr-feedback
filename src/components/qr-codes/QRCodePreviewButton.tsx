"use client";

import { Button } from "@mui/material";

type QRCodePreviewButtonProps = {
    onClick: () => void;
};

export default function QRCodePreviewButton({
    onClick,
}: QRCodePreviewButtonProps) {
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
                color: "#193B56",
                textTransform: "none",

                "&:hover": {
                    backgroundColor: "#f2f4f7",
                },
            }}
        >
            Xem QR
        </Button>
    );
}
