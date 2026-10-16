"use client";

import { Button, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";

import QRDialog from "@/components/common/dialog/QRDialog";
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
    return (
        <QRDialog
            open={open}
            onClose={onClose}
            title="Xóa ảnh?"
            maxWidth="xs"
            actions={
                <>
                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={onClose}
                        sx={buttonBaseCancelSx}
                    >
                        Hủy
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
                        Xác nhận
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
                Bạn có muốn đánh dấu xóa {title}? Ảnh chỉ bị xóa khỏi hệ thống
                khi bạn nhấn Lưu thay đổi.
            </Typography>
        </QRDialog>
    );
}
