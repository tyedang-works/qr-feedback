"use client";

import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { useDebounce } from "@/hooks/useDebounce";
import type {
    QRCodePageSize,
    QRCodeSort,
    QRCodeStatusFilter,
} from "@/lib/qr-codes/types";
import { MenuItem, Stack } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZES: QRCodePageSize[] = [10, 25, 50];

const STATUS_OPTIONS: {
    value: QRCodeStatusFilter;
    label: string;
}[] = [
    {
        value: "all",
        label: "Tất cả trạng thái",
    },
    {
        value: "active",
        label: "Đang hoạt động",
    },
    {
        value: "inactive",
        label: "Đang tắt",
    },
];

const SORT_OPTIONS: {
    value: QRCodeSort;
    label: string;
}[] = [
    {
        value: "name_asc",
        label: "Tên bàn A → Z",
    },
    {
        value: "name_desc",
        label: "Tên bàn Z → A",
    },
];

function isPageSize(value: number): value is QRCodePageSize {
    return PAGE_SIZES.includes(value as QRCodePageSize);
}

function isStatus(value: string): value is QRCodeStatusFilter {
    return STATUS_OPTIONS.some((option) => option.value === value);
}

function isSort(value: string): value is QRCodeSort {
    return SORT_OPTIONS.some((option) => option.value === value);
}

export default function QRCodeFilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const keywordParam = searchParams.get("keyword") ?? "";

    const [keyword, setKeyword] = useState(keywordParam);

    const debouncedKeyword = useDebounce(keyword, 400);

    const statusParam = searchParams.get("status") ?? "all";

    const status = isStatus(statusParam) ? statusParam : "all";

    const sortParam = searchParams.get("sort") ?? "name_asc";

    const sort = isSort(sortParam) ? sortParam : "name_asc";

    const pageSizeParam = Number(searchParams.get("pageSize") ?? "10");

    const pageSize = isPageSize(pageSizeParam) ? pageSizeParam : 10;

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
                return;
            }

            params.set(key, value);
        });

        params.set("page", "1");

        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleKeywordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setKeyword(event.target.value);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        updateParams({
            status: event.target.value,
        });
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        updateParams({
            sort: event.target.value,
        });
    };

    const handlePageSizeChange = (event: SelectChangeEvent) => {
        updateParams({
            pageSize: event.target.value,
        });
    };

    useEffect(() => {
        if (debouncedKeyword === keywordParam) {
            return;
        }

        updateParams({
            keyword: debouncedKeyword,
        });
    }, [debouncedKeyword, keywordParam]);

    return (
        <Stack
            sx={{
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                gap: 1.5,
                alignItems: {
                    xs: "stretch",
                    sm: "center",
                },
            }}
        >
            <QRTextField
                value={keyword}
                onChange={handleKeywordChange}
                placeholder="Tìm bàn..."
                size="small"
                fullWidth
                slotProps={{
                    htmlInput: {
                        "aria-label": "Tìm bàn",
                    },
                }}
            />

            <QRSelect
                value={status}
                onChange={handleStatusChange}
                size="small"
                inputProps={{
                    "aria-label": "Lọc trạng thái",
                }}
                sx={{
                    maxWidth: {
                        sm: 180,
                    },
                }}
            >
                {STATUS_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </QRSelect>

            <QRSelect
                value={sort}
                onChange={handleSortChange}
                size="small"
                inputProps={{
                    "aria-label": "Sắp xếp",
                }}
                sx={{
                    maxWidth: {
                        sm: 170,
                    },
                }}
            >
                {SORT_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </QRSelect>

            <QRSelect
                value={String(pageSize)}
                onChange={handlePageSizeChange}
                size="small"
                inputProps={{
                    "aria-label": "Số bàn mỗi trang",
                }}
                sx={{
                    maxWidth: {
                        sm: 120,
                    },
                }}
            >
                {PAGE_SIZES.map((size) => (
                    <MenuItem
                        key={size}
                        value={String(size)}
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        {size} / trang
                    </MenuItem>
                ))}
            </QRSelect>
        </Stack>
    );
}
