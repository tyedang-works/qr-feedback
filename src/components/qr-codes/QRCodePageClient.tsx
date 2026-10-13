"use client";

import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Stack } from "@mui/material";
import { useState } from "react";

import PageHeader from "@/components/common/layout/PageHeader";
import QRCodeFilterBar from "./QRCodeFilterBar";
import QRCodeList from "./QRCodeList";

import type { QRCodeFilters, QRCodeListResult } from "@/lib/qr-codes/types";

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
        <Stack sx={{ gap: 3, width: "100%", minWidth: 0 }}>
            {!isPrintMode && (
                <>
                    <PageHeader
                        title="QR Codes"
                        subtitle="Quản lý mã QR và trạng thái bàn của nhà hàng."
                        icon={faQrcode}
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
