"use client";

import { Pagination, Stack, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { QRCodePageSize } from "@/lib/qr-codes/types";

type QRCodePaginationProps = {
    page: number;
    totalPages: number;
    total: number;
    pageSize: QRCodePageSize;
};

export default function QRCodePagination({
    page,
    totalPages,
    total,
    pageSize,
}: QRCodePaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (total === 0 || totalPages <= 1) {
        return null;
    }

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        nextPage: number,
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(nextPage));

        router.push(`${pathname}?${params.toString()}`);
    };

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return (
        <Stack
            sx={{
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                alignItems: {
                    xs: "flex-start",
                    sm: "center",
                },
                justifyContent: "space-between",
                gap: 2,
                px: 1,
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    fontSize: 14,
                }}
            >
                {from}–{to} trong {total} bàn
            </Typography>

            <Pagination
                count={totalPages}
                page={Math.min(page, totalPages)}
                onChange={handlePageChange}
                size="small"
                shape="rounded"
                color="primary"
                siblingCount={1}
                boundaryCount={1}
            />
        </Stack>
    );
}
