"use client";

import { Stack } from "@mui/material";
import { useState } from "react";

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
    const [isBulkPrinting, setIsBulkPrinting] = useState(false);

    return (
        <Stack sx={{ gap: 2 }}>
            {!isBulkPrinting && <QRCodeFilterBar />}

            <QRCodeList
                result={result}
                filters={filters}
                onBulkPrintStart={() => setIsBulkPrinting(true)}
                onBulkPrintClose={() => setIsBulkPrinting(false)}
            />
        </Stack>
    );
}
