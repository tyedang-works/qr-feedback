"use client";

import { buttonBaseSx } from "@/styles/button.styles";
import { Button, CircularProgress as MuiCircularProgress } from "@mui/material";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";

type ExportFeedbackButtonProps = {
    href: string;
    disabled?: boolean;
};

export default function ExportFeedbackButton({
    href,
    disabled = false,
}: ExportFeedbackButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        if (disabled || isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(href);

            if (!response.ok) {
                throw new Error("Không thể xuất file Excel.");
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = getFilename(response.headers) ?? "feedback.xlsx";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
            }, 1000);
        } catch (error) {
            console.error("Failed to export feedback:", error);
            window.alert("Xuất Excel thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            disabled={disabled || isLoading}
            onClick={handleExport}
            startIcon={
                isLoading ? (
                    <MuiCircularProgress
                        size={18}
                        thickness={5}
                        color="inherit"
                        aria-label="Đang xuất Excel"
                    />
                ) : (
                    <FileSpreadsheet size={18} strokeWidth={1.8} />
                )
            }
            sx={{
                ...buttonBaseSx,
                minWidth: 132,
                whiteSpace: "nowrap",
            }}
        >
            {isLoading ? "Đang xuất..." : "Xuất Excel"}
        </Button>
    );
}

function getFilename(headers: Headers): string | null {
    const disposition = headers.get("content-disposition");

    if (!disposition) {
        return null;
    }

    const encodedFilename = disposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (encodedFilename?.[1]) {
        return decodeURIComponent(encodedFilename[1]);
    }

    const filename = disposition.match(/filename="?([^";]+)"?/i);

    return filename?.[1] ?? null;
}
