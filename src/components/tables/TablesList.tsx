"use client";

import DeleteTableDialog from "@/components/tables/DeleteTableDialog";
import EditTableDialog from "@/components/tables/EditTableDialog";
import TableStatusSwitch from "@/components/tables/TableStatusSwitch";
import { useTranslation } from "@/components/common/providers/useTranslation";
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
    { value: "all", labelKey: "allTableStatuses" },
    { value: "active", labelKey: "tableStatusActive" },
    { value: "inactive", labelKey: "tableStatusInactive" },
] as const;

const dividerSx = {
    borderColor: "var(--color-border, #E5E7EB)",
};

export default function TablesList({ data, canManageTables }: TablesListProps) {
    const { t, locale } = useTranslation();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<TableStatusFilter>("all");

    const tableNames = useMemo(() => data.map((table) => table.name), [data]);

    const filteredTables = useMemo(() => {
        const searchLocale = locale === "en" ? "en-US" : "vi";
        const keyword = search.trim().toLocaleLowerCase(searchLocale);

        return data.filter((table) => {
            const matchesSearch =
                !keyword ||
                table.name.toLocaleLowerCase(searchLocale).includes(keyword) ||
                table.token.toLocaleLowerCase(searchLocale).includes(keyword);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && table.isActive) ||
                (statusFilter === "inactive" && !table.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [data, search, statusFilter, locale]);

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
                            placeholder={t("table", "searchTablePlaceholder")}
                            aria-label={t("table", "searchTableAriaLabel")}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Box
                                            component="span"
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                color: "var(--color-text-muted, #98A2B3)",
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
                                "& .MuiOutlinedInput-input": {
                                    paddingTop: "14px",
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
                                    "aria-label": t(
                                        "table",
                                        "filterTableStatusAriaLabel",
                                    ),
                                }}
                            >
                                {STATUS_FILTER_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {t("table", option.labelKey)}
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
                                color: "var(--color-text-secondary, #667085)",
                            }}
                        >
                            {t("table", "showing")}{" "}
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 600,
                                    color: "var(--color-text-primary, #193B56)",
                                }}
                            >
                                {filteredTables.length}
                            </Box>{" "}
                            / {data.length} {t("table", "tables")}
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
                                    color: "var(--color-text-primary, #193B56)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                {t("table", "clearFilters")}
                            </Box>
                        )}
                    </Stack>
                </Box>
            )}

            <Box sx={{ ...cardSx, p: 0, overflow: "clip" }}>
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
                                color: "var(--color-text-primary, #344054)",
                            }}
                        >
                            {t("table", "noTablesYet")}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                color: "var(--color-text-muted, #98A2B3)",
                            }}
                        >
                            {t("table", "addFirstTableDescription")}
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
                                color: "var(--color-text-primary, #344054)",
                            }}
                        >
                            {t("table", "noMatchingTables")}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                color: "var(--color-text-muted, #98A2B3)",
                            }}
                        >
                            {t("table", "changeTableSearchDescription")}
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
                                    color: "var(--color-text-primary, #193B56)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                {t("table", "clearFilters")}
                            </Box>
                        )}
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
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
                                    minHeight: 56,
                                    boxSizing: "border-box",
                                    backgroundColor:
                                        "var(--color-table-header-bg)",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 10,
                                    boxShadow: "0 1px 0 var(--color-border)",
                                }}
                            >
                                <Typography sx={tableColumnHeaderSx}>
                                    {t("table", "tableName")}
                                </Typography>

                                <Typography sx={tableColumnHeaderSx}>
                                    {t("table", "qrIdentifier")}
                                </Typography>

                                <Typography sx={tableColumnHeaderSx}>
                                    {t("table", "tableActivityStatus")}
                                </Typography>

                                {canManageTables && (
                                    <Typography
                                        sx={{
                                            ...tableColumnHeaderSx,
                                            textAlign: "center",
                                        }}
                                    >
                                        {t("table", "actions")}
                                    </Typography>
                                )}
                            </Box>

                            {filteredTables.map((table, index) => (
                                <Box key={table.id}>
                                    {index > 0 && <Divider sx={dividerSx} />}

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
                                                backgroundColor:
                                                    "var(--color-surface-hover, #F9FAFB)",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                minWidth: 0,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "var(--color-text-primary, #193B56)",
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
                                                color: "var(--color-text-secondary, #475467)",
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
                                    {index > 0 && <Divider sx={dividerSx} />}

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
                                                        color: "var(--color-text-primary, #193B56)",
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
                                                        color: "var(--color-text-secondary, #667085)",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {t("table", "qrIdentifier")}
                                                    : {table.token}
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
