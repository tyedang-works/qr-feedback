"use client";

import DeleteTableDialog from "@/components/tables/DeleteTableDialog";
import EditTableDialog from "@/components/tables/EditTableDialog";
import TableStatusSwitch from "@/components/tables/TableStatusSwitch";
import type { RestaurantTable } from "@/lib/tables/types";
import { cardSx } from "@/styles/card.styles";
import { tableColumnHeaderSx } from "@/styles/table.styles";
import { Box, Divider, MenuItem, Stack, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import QRSelect from "../common/input/QRSelect";
import QRTextField from "../common/input/QRTextField";

type TablesListProps = {
    data: RestaurantTable[];
    canManageTables: boolean;
};

type TableStatusFilter = "all" | "active" | "inactive";

const STATUS_FILTER_OPTIONS = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Đã tắt" },
] as const;

export default function TablesList({ data, canManageTables }: TablesListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<TableStatusFilter>("all");

    const tableNames = useMemo(() => data.map((table) => table.name), [data]);

    const filteredTables = useMemo(() => {
        const keyword = search.trim().toLocaleLowerCase("vi");

        return data.filter((table) => {
            const matchesSearch =
                !keyword ||
                table.name.toLocaleLowerCase("vi").includes(keyword) ||
                table.token.toLocaleLowerCase("vi").includes(keyword);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && table.isActive) ||
                (statusFilter === "inactive" && !table.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [data, search, statusFilter]);

    const hasFilters = search.trim().length > 0 || statusFilter !== "all";

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    return (
        <Stack sx={{ gap: 2 }}>
            {data.length > 0 && (
                <Box sx={{ ...cardSx, p: { xs: 2, sm: 2.5 } }}>
                    <Stack
                        sx={{
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: 1.5,
                        }}
                    >
                        <QRTextField
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Tìm theo tên bàn hoặc mã QR..."
                            aria-label="Tìm bàn"
                            slotProps={{
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
                                },
                            }}
                            sx={{
                                flex: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                },
                            }}
                        />

                        <Box
                            sx={{
                                width: { xs: "100%", sm: 230 },
                                flexShrink: 0,
                            }}
                        >
                            <QRSelect
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value as TableStatusFilter,
                                    )
                                }
                                inputProps={{
                                    "aria-label": "Lọc trạng thái bàn",
                                }}
                            >
                                {STATUS_FILTER_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </QRSelect>
                        </Box>
                    </Stack>

                    <Stack
                        sx={{
                            mt: 1.5,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            flexWrap: "wrap",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#667085",
                            }}
                        >
                            Hiển thị{" "}
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 600,
                                    color: "#193B56",
                                }}
                            >
                                {filteredTables.length}
                            </Box>{" "}
                            / {data.length} bàn
                        </Typography>

                        {hasFilters && (
                            <Box
                                component="button"
                                type="button"
                                onClick={resetFilters}
                                sx={{
                                    p: 0,
                                    border: 0,
                                    background: "transparent",
                                    color: "#193B56",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Xóa bộ lọc
                            </Box>
                        )}
                    </Stack>
                </Box>
            )}

            <Box sx={{ ...cardSx, overflow: "hidden" }}>
                {data.length === 0 ? (
                    <Box
                        sx={{
                            px: 2,
                            py: 6,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            Chưa có bàn nào
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                color: "#98a2b3",
                            }}
                        >
                            Hãy thêm bàn đầu tiên cho nhà hàng của bạn.
                        </Typography>
                    </Box>
                ) : filteredTables.length === 0 ? (
                    <Box
                        sx={{
                            px: 2,
                            py: 6,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#344054",
                            }}
                        >
                            Không tìm thấy bàn phù hợp
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                color: "#98a2b3",
                            }}
                        >
                            Thử thay đổi từ khóa hoặc bộ lọc trạng thái.
                        </Typography>

                        {hasFilters && (
                            <Box
                                component="button"
                                type="button"
                                onClick={resetFilters}
                                sx={{
                                    mt: 1.5,
                                    p: 0,
                                    border: 0,
                                    background: "transparent",
                                    color: "#193B56",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Xóa bộ lọc
                            </Box>
                        )}
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: { xs: "none", sm: "block" },
                                overflowX: "auto",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: canManageTables
                                        ? "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px"
                                        : "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr)",
                                    alignItems: "center",
                                    gap: 2,
                                    px: 2.5,
                                    py: 1.5,
                                    backgroundColor: "#f8fafc",
                                }}
                            >
                                <Typography sx={tableColumnHeaderSx}>
                                    Bàn
                                </Typography>

                                <Typography sx={tableColumnHeaderSx}>
                                    Định danh QR
                                </Typography>

                                <Typography sx={tableColumnHeaderSx}>
                                    Trạng thái hoạt động
                                </Typography>

                                {canManageTables && (
                                    <Typography
                                        sx={{
                                            ...tableColumnHeaderSx,
                                            textAlign: "left",
                                            color: "#667085",
                                        }}
                                    >
                                        Thao tác
                                    </Typography>
                                )}
                            </Box>

                            <Divider />

                            {filteredTables.map((table, index) => (
                                <Box key={table.id}>
                                    {index > 0 && <Divider />}

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: canManageTables
                                                ? "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px"
                                                : "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr)",
                                            alignItems: "center",
                                            gap: 2,
                                            px: 2.5,
                                            py: 1.75,
                                            transition:
                                                "background-color 150ms ease",
                                            "&:hover": {
                                                backgroundColor: "#f8fafc",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                minWidth: 0,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "#193B56",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {table.name}
                                        </Typography>

                                        <Typography
                                            title={table.token}
                                            sx={{
                                                minWidth: 0,
                                                fontSize: 12,
                                                color: "#475467",
                                                overflowWrap: "anywhere",
                                                wordBreak: "break-word",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {table.token}
                                        </Typography>

                                        <TableStatusSwitch
                                            tableId={table.id}
                                            isActive={table.isActive}
                                            canManageTables={canManageTables}
                                        />

                                        {canManageTables && (
                                            <Stack
                                                sx={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "flex-start",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <EditTableDialog
                                                    tableId={table.id}
                                                    tableName={table.name}
                                                    tableNames={tableNames}
                                                />

                                                <DeleteTableDialog
                                                    tableId={table.id}
                                                    tableName={table.name}
                                                    disabled={table.hasFeedback}
                                                />
                                            </Stack>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Stack sx={{ display: { xs: "flex", sm: "none" } }}>
                            {filteredTables.map((table, index) => (
                                <Box key={table.id}>
                                    {index > 0 && <Divider />}

                                    <Box sx={{ px: 2, py: 2 }}>
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "flex-start",
                                                justifyContent: "space-between",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    minWidth: 0,
                                                    flex: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 15,
                                                        fontWeight: 600,
                                                        color: "#193B56",
                                                        overflowWrap:
                                                            "anywhere",
                                                    }}
                                                >
                                                    {table.name}
                                                </Typography>

                                                <Typography
                                                    title={table.token}
                                                    sx={{
                                                        mt: 0.5,
                                                        fontSize: 12,
                                                        color: "#667085",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    Định danh QR: {table.token}
                                                </Typography>
                                            </Box>

                                            {canManageTables && (
                                                <Stack
                                                    sx={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <EditTableDialog
                                                        tableId={table.id}
                                                        tableName={table.name}
                                                        tableNames={tableNames}
                                                    />

                                                    <DeleteTableDialog
                                                        tableId={table.id}
                                                        tableName={table.name}
                                                        disabled={
                                                            table.hasFeedback
                                                        }
                                                    />
                                                </Stack>
                                            )}
                                        </Stack>

                                        <Box sx={{ mt: 1.25 }}>
                                            <TableStatusSwitch
                                                tableId={table.id}
                                                isActive={table.isActive}
                                                canManageTables={
                                                    canManageTables
                                                }
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </>
                )}
            </Box>
        </Stack>
    );
}
