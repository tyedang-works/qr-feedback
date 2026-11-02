"use client";

import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { useTranslation } from "@/components/common/providers/useTranslation";
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
    labelKey: "allStatuses" | "tableStatusActive" | "tableStatusInactive";
}[] = [
    { value: "all", labelKey: "allStatuses" },
    { value: "active", labelKey: "tableStatusActive" },
    { value: "inactive", labelKey: "tableStatusInactive" },
];

const SORT_OPTIONS: {
    value: QRCodeSort;
    labelKey: "tableNameAscending" | "tableNameDescending";
}[] = [
    { value: "name_asc", labelKey: "tableNameAscending" },
    { value: "name_desc", labelKey: "tableNameDescending" },
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
    const { t } = useTranslation();

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
            aria-label={t("qrCode", "qrCodeFilters")}
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
                    label={t("qrCode", "searchTables")}
                    value={keyword}
                    onChange={handleKeywordChange}
                    placeholder={t("qrCode", "searchTablePlaceholder")}
                    size="small"
                    slotProps={{
                        htmlInput: {
                            "aria-label": t("qrCode", "searchTables"),
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
                                    <Tooltip
                                        title={t("qrCode", "clearKeyword")}
                                    >
                                        <IconButton
                                            type="button"
                                            size="small"
                                            aria-label={t(
                                                "qrCode",
                                                "clearSearchKeyword",
                                            )}
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
                    label={t("qrCode", "status")}
                    value={status}
                    onChange={handleStatusChange}
                    size="small"
                    inputProps={{
                        "aria-label": t("qrCode", "filterStatus"),
                    }}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {t("qrCode", option.labelKey)}
                        </MenuItem>
                    ))}
                </QRSelect>

                <QRSelect
                    label={t("qrCode", "sortBy")}
                    value={sort}
                    onChange={handleSortChange}
                    size="small"
                    inputProps={{
                        "aria-label": t("qrCode", "sortTables"),
                    }}
                >
                    {SORT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {t("qrCode", option.labelKey)}
                        </MenuItem>
                    ))}
                </QRSelect>

                <QRSelect
                    label={t("qrCode", "display")}
                    value={String(pageSize)}
                    onChange={handlePageSizeChange}
                    size="small"
                    inputProps={{
                        "aria-label": t("qrCode", "tablesPerPage"),
                    }}
                >
                    {PAGE_SIZES.map((size) => (
                        <MenuItem key={size} value={String(size)}>
                            {size} / {t("qrCode", "perPage")}
                        </MenuItem>
                    ))}
                </QRSelect>
            </Box>
        </Card>
    );
}
