"use client";

import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { useDebounce } from "@/hooks/useDebounce";
import type {
    QRCodePageSize,
    QRCodeSort,
    QRCodeStatusFilter,
} from "@/lib/qr-codes/types";
import { cardSx } from "@/styles/card.styles";
import {
    Box,
    Card,
    IconButton,
    InputAdornment,
    MenuItem,
    Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDashboardLoading } from "../dashboard/DashboardLoadingProvider";

const PAGE_SIZES: QRCodePageSize[] = [10, 25, 50];

const STATUS_OPTIONS: {
    value: QRCodeStatusFilter;
    label: string;
}[] = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Đang tắt" },
];

const SORT_OPTIONS: {
    value: QRCodeSort;
    label: string;
}[] = [
    { value: "name_asc", label: "Tên bàn A → Z" },
    { value: "name_desc", label: "Tên bàn Z → A" },
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
    const { startNavigation } = useDashboardLoading();

    const keywordParam = searchParams.get("keyword") ?? "";
    const statusParam = searchParams.get("status") ?? "all";
    const sortParam = searchParams.get("sort") ?? "name_asc";
    const pageSizeParam = Number(searchParams.get("pageSize") ?? "10");

    const [keyword, setKeyword] = useState(keywordParam);

    const debouncedKeyword = useDebounce(keyword, 400);

    const status = isStatus(statusParam) ? statusParam : "all";
    const sort = isSort(sortParam) ? sortParam : "name_asc";
    const pageSize = isPageSize(pageSizeParam) ? pageSizeParam : 10;

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            params.set("page", "1");

            const query = params.toString();
            const nextUrl = query ? `${pathname}?${query}` : pathname;
            const currentQuery = searchParams.toString();
            const currentUrl = currentQuery
                ? `${pathname}?${currentQuery}`
                : pathname;

            if (nextUrl !== currentUrl) {
                startNavigation();
                router.replace(nextUrl, { scroll: false });
            }
        },
        [pathname, router, searchParams, startNavigation],
    );

    const handleKeywordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setKeyword(event.target.value);
    };

    const handleClearKeyword = () => {
        setKeyword("");
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        updateParams({ status: event.target.value });
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        updateParams({ sort: event.target.value });
    };

    const handlePageSizeChange = (event: SelectChangeEvent) => {
        updateParams({ pageSize: event.target.value });
    };

    useEffect(() => {
        if (debouncedKeyword === keywordParam) {
            return;
        }

        updateParams({
            keyword: debouncedKeyword.trim() || null,
        });
    }, [debouncedKeyword, keywordParam, updateParams]);

    return (
        <Card
            component="section"
            aria-label="Bộ lọc bàn"
            elevation={0}
            sx={cardSx}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: [
                            "minmax(240px, 2fr)",
                            "minmax(180px, 1.1fr)",
                            "minmax(190px, 1.2fr)",
                            "minmax(130px, 0.8fr)",
                        ].join(" "),
                    },
                    gap: 1.5,
                    alignItems: "start",
                }}
            >
                <QRTextField
                    label="Tìm kiếm bàn"
                    value={keyword}
                    onChange={handleKeywordChange}
                    placeholder="Nhập tên bàn..."
                    size="small"
                    slotProps={{
                        htmlInput: {
                            "aria-label": "Tìm kiếm bàn",
                        },
                        input: {
                            startAdornment: (
                                <Box
                                    component="span"
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        color: "#98a2b3",
                                    }}
                                >
                                    <Search size={16} />
                                </Box>
                            ),

                            endAdornment: keyword ? (
                                <InputAdornment position="end">
                                    <Tooltip title="Xóa từ khóa">
                                        <IconButton
                                            type="button"
                                            size="small"
                                            aria-label="Xóa từ khóa tìm kiếm"
                                            onClick={handleClearKeyword}
                                            edge="end"
                                            sx={{
                                                paddingLeft: "2px",
                                                paddingRight: "2px",
                                                paddingTop: "3px",
                                                paddingBottom: "3px",
                                            }}
                                        >
                                            <X size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ) : undefined,
                        },
                    }}
                />

                <QRSelect
                    label="Trạng thái"
                    value={status}
                    onChange={handleStatusChange}
                    size="small"
                    inputProps={{
                        "aria-label": "Lọc trạng thái",
                    }}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </QRSelect>

                <QRSelect
                    label="Sắp xếp theo"
                    value={sort}
                    onChange={handleSortChange}
                    size="small"
                    inputProps={{
                        "aria-label": "Sắp xếp bàn",
                    }}
                >
                    {SORT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </QRSelect>

                <QRSelect
                    label="Hiển thị"
                    value={String(pageSize)}
                    onChange={handlePageSizeChange}
                    size="small"
                    inputProps={{
                        "aria-label": "Số bàn mỗi trang",
                    }}
                >
                    {PAGE_SIZES.map((size) => (
                        <MenuItem key={size} value={String(size)}>
                            {size} / trang
                        </MenuItem>
                    ))}
                </QRSelect>
            </Box>
        </Card>
    );
}
