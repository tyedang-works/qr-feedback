"use client";

import { useDashboardLoading } from "@/components/dashboard/DashboardLoadingProvider";
import { useTranslation } from "@/components/common/providers/useTranslation";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";

type FeedbackPaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

export default function FeedbackPagination({
    page,
    pageSize,
    total,
    totalPages,
}: FeedbackPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { startNavigation } = useDashboardLoading();
    const { t } = useTranslation();

    if (total === 0 || totalPages <= 1) {
        return null;
    }

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    const handlePageChange = (
        _event: ChangeEvent<unknown>,
        nextPage: number,
    ) => {
        if (nextPage === page) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextPage));

        startNavigation();

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };

    return (
        <Box sx={{ width: "100%", pt: 1 }}>
            <Stack
                sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: {
                        xs: "center",
                        sm: "space-between",
                    },
                    gap: 1.5,
                    minWidth: 0,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "#667085",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                >
                    {t("feedback", "showing")}{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: "var(--color-text-primary, #193B56)",
                        }}
                    >
                        {from}–{to}
                    </Box>{" "}
                    {t("feedback", "of")}{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: "var(--color-text-primary, #193B56)",
                        }}
                    >
                        {total}
                    </Box>{" "}
                    {t("feedback", "responses")}
                </Typography>

                <Pagination
                    aria-label={t("feedback", "pagination")}
                    page={page}
                    count={totalPages}
                    onChange={handlePageChange}
                    getItemAriaLabel={(type, pageNumber, selected) => {
                        switch (type) {
                            case "page":
                                return selected
                                    ? `${t("feedback", "page")} ${pageNumber}`
                                    : `${t("feedback", "goToPage")} ${pageNumber}`;

                            case "previous":
                                return t("feedback", "previousPage");

                            case "next":
                                return t("feedback", "nextPage");

                            case "first":
                                return t("feedback", "firstPage");

                            case "last":
                                return t("feedback", "lastPage");

                            default:
                                return "";
                        }
                    }}
                    siblingCount={0}
                    boundaryCount={1}
                    size="small"
                    shape="rounded"
                    sx={{
                        "& .MuiPagination-ul": {
                            justifyContent: {
                                xs: "center",
                                sm: "flex-end",
                            },
                            flexWrap: "nowrap",
                        },

                        "& .MuiPaginationItem-root": {
                            minWidth: 36,
                            height: 36,
                            margin: "0 2px",
                            borderRadius: 1.5,
                            fontSize: 13,
                            color: "var(--color-pagination-text)",
                            transition:
                                "background-color 150ms ease, color 150ms ease",

                            "&:hover": {
                                backgroundColor:
                                    "var(--color-pagination-hover)",
                            },
                        },

                        "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor:
                                "var(--color-pagination-selected-bg)",
                            color: "var(--color-pagination-selected-text)",
                            fontWeight: 600,

                            "&:hover": {
                                backgroundColor:
                                    "var(--color-pagination-selected-bg)",
                            },
                        },

                        "& .MuiPaginationItem-previousNext": {
                            border: "1px solid var(--color-pagination-border)",
                        },

                        "& .MuiPaginationItem-root.Mui-disabled": {
                            color: "var(--color-pagination-disabled-text)",
                            cursor: "default",
                        },

                        "& .MuiPaginationItem-previousNext.Mui-disabled": {
                            borderColor:
                                "var(--color-pagination-disabled-border)",
                        },
                    }}
                />
            </Stack>
        </Box>
    );
}
