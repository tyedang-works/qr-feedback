"use client";

import PageHeader from "@/components/common/layout/PageHeader";
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
    const [isPrintMode, setIsPrintMode] = useState(false);

    return (
        <Stack sx={{ gap: 2, width: "100%", minWidth: 0 }}>
            {!isPrintMode && (
                <>
                    <PageHeader
                        title="QR Codes"
                        subtitle="Quản lý mã QR và trạng thái bàn của nhà hàng."
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
