"use client";

import { Stack } from "@mui/material";
import { useState } from "react";

import QRCodeFilterBar from "./QRCodeFilterBar";
import QRCodeList from "./QRCodeList";

import type { QRCodeListResult } from "@/lib/qr-codes/types";

type QRCodePageClientProps = {
    result: QRCodeListResult;
};

export default function QRCodePageClient({ result }: QRCodePageClientProps) {
    const [isBulkPrinting, setIsBulkPrinting] = useState(false);

    return (
        <Stack sx={{ gap: 2 }}>
            {!isBulkPrinting && <QRCodeFilterBar />}

            <QRCodeList
                result={result}
                onBulkPrintStart={() => setIsBulkPrinting(true)}
                onBulkPrintClose={() => setIsBulkPrinting(false)}
            />
        </Stack>
    );
}
