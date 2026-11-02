"use client";

import PageHeader from "@/components/common/layout/PageHeader";
import { useTranslation } from "@/components/common/providers/useTranslation";
import type { QRCodeFilters, QRCodeListResult } from "@/lib/qr-codes/types";
import { Stack } from "@mui/material";
import { QrCode } from "lucide-react";
import { useState } from "react";
import QRCodeFilterBar from "./QRCodeFilterBar";
import QRCodeList from "./QRCodeList";

type QRCodePageClientProps = {
    result: QRCodeListResult;
    filters: QRCodeFilters;
};

export default function QRCodePageClient({
    result,
    filters,
}: QRCodePageClientProps) {
    const { t } = useTranslation();

    const [isPrintMode, setIsPrintMode] = useState(false);

    return (
        <Stack sx={{ gap: 2, width: "100%", minWidth: 0 }}>
            {!isPrintMode && (
                <>
                    <PageHeader
                        title={t("qrCode", "qrCodes")}
                        subtitle={t("qrCode", "qrCodesDescription")}
                        icon={QrCode}
                    />

                    <QRCodeFilterBar />
                </>
            )}

            <QRCodeList
                result={result}
                filters={filters}
                onBulkPrintStart={() => setIsPrintMode(true)}
                onBulkPrintClose={() => setIsPrintMode(false)}
                onPrintModeChange={setIsPrintMode}
            />
        </Stack>
    );
}
