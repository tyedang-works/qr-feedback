"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import { buttonBaseSx } from "@/styles/button.styles";
import { Button, CircularProgress as MuiCircularProgress } from "@mui/material";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

type ExportFeedbackButtonProps = {
    href: string;
    disabled?: boolean;
};

export default function ExportFeedbackButton({
    href,
    disabled = false,
}: ExportFeedbackButtonProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        if (disabled || isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch(href);

            if (!response.ok) {
                throw new Error("exportFeedbackFailed");
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            disabled={disabled || isLoading}
            onClick={handleExport}
            aria-label={t("dashboard", "exportExcel")}
            title={t("dashboard", "exportExcel")}
            startIcon={
                isLoading ? (
                    <MuiCircularProgress
                        size={16}
                        thickness={5}
                        color="inherit"
                    />
                ) : (
                    <FileSpreadsheet size={17} strokeWidth={1.8} />
                )
            }
            sx={{
                ...buttonBaseSx,
                height: 42,
                minHeight: 42,
                fontSize: "13px",
                fontWeight: 500,
                minWidth: { xs: 42, sm: 100 },
                width: { xs: 42, sm: "auto" },
                px: { xs: 0, sm: 2 },
                flexShrink: 0,
                whiteSpace: "nowrap",
                "& .MuiButton-startIcon": {
                    mr: { xs: 0, sm: 0.75 },
                    ml: 0,
                },
            }}
        >
            {!isMobile &&
                (isLoading
                    ? t("dashboard", "exporting")
                    : t("dashboard", "exportExcel"))}
        </Button>
    );
}

function getFilename(headers: Headers): string | null {
    const disposition = headers.get("content-disposition");

    if (!disposition) return null;

    const encodedFilename = disposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (encodedFilename?.[1]) {
        try {
            return decodeURIComponent(encodedFilename[1]);
        } catch {
            return encodedFilename[1];
        }
    }

    const filename = disposition.match(/filename="?([^";]+)"?/i);

    return filename?.[1] ?? null;
}
