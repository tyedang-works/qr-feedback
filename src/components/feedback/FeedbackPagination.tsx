"use client";

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

    if (total === 0 || totalPages <= 1) {
        return null;
    }

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    const handlePageChange = (
        _event: ChangeEvent<unknown>,
        nextPage: number,
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(nextPage));

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
                    Hiển thị{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: "var(--color-text-primary, #193B56)",
                        }}
                    >
                        {from}–{to}
                    </Box>{" "}
                    trong{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: "var(--color-text-primary, #193B56)",
                        }}
                    >
                        {total}
                    </Box>{" "}
                    phản hồi
                </Typography>

                <Pagination
                    page={page}
                    count={totalPages}
                    onChange={handlePageChange}
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
                            color: "#344054",
                        },

                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "#F2F4F7",
                        },

                        "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "#193B56",
                            color: "#FFFFFF",
                        },

                        "& .MuiPaginationItem-root.Mui-selected:hover": {
                            backgroundColor: "#193B56",
                        },

                        "& .MuiPaginationItem-previousNext": {
                            border: "1px solid #D0D5DD",
                        },

                        "& .MuiPaginationItem-previousNext.Mui-disabled": {
                            borderColor: "#EAECF0",
                            color: "#D0D5DD",
                        },
                    }}
                />
            </Stack>
        </Box>
    );
}
