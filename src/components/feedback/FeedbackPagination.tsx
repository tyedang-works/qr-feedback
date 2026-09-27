"use client";

import {
    Box,
    Pagination,
    Stack,
    Typography,
} from "@mui/material";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

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
        _event: React.ChangeEvent<unknown>,
        nextPage: number,
    ) => {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        params.set("page", String(nextPage));

        router.push(
            `${pathname}?${params.toString()}`,
            {
                scroll: false,
            },
        );
    };

    return (
        <Box
            sx={{
                width: "100%",
                pt: 1,
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr auto 1fr",
                    },
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* Result count */}
                <Typography
                    sx={{
                        fontSize: 13,
                        color: "#667085",
                        textAlign: {
                            xs: "center",
                            sm: "left",
                        },
                    }}
                >
                    Hiển thị{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: "#344054",
                        }}
                    >
                        {from}–{to}
                    </Box>{" "}
                    trong{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: "#344054",
                        }}
                    >
                        {total}
                    </Box>{" "}
                    phản hồi
                </Typography>

                {/* MUI Pagination */}
                <Stack
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
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
                                justifyContent: "center",
                            },

                            "& .MuiPaginationItem-root": {
                                minWidth: 36,
                                height: 36,
                                margin: "0 2px",
                                borderRadius: 1.5,
                                fontSize: 13,
                                color: "#344054",
                            },

                            "& .MuiPaginationItem-root:hover":
                            {
                                backgroundColor:
                                    "#f2f4f7",
                            },

                            "& .MuiPaginationItem-root.Mui-selected":
                            {
                                backgroundColor:
                                    "#193B56",
                                color: "#ffffff",
                            },

                            "& .MuiPaginationItem-root.Mui-selected:hover":
                            {
                                backgroundColor:
                                    "#193B56",
                            },

                            "& .MuiPaginationItem-previousNext":
                            {
                                border: "1px solid #d0d5dd",
                            },

                            "& .MuiPaginationItem-previousNext.Mui-disabled":
                            {
                                borderColor:
                                    "#eaecf0",
                                color: "#d0d5dd",
                            },
                        }}
                    />
                </Stack>

                {/* Desktop spacer */}
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />
            </Box>
        </Box>
    );
}