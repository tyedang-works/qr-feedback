"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import DeleteTableDialog from "@/components/tables/DeleteTableDialog";
import EditTableDialog from "@/components/tables/EditTableDialog";
import TableStatusSwitch from "@/components/tables/TableStatusSwitch";
import type { RestaurantTable } from "@/lib/tables/types";
import { chipBaseSx } from "@/styles/button.styles";
import { cardSx } from "@/styles/card.styles";
import { tableColumnHeaderSx } from "@/styles/table.styles";
import { Box, Chip, Divider, MenuItem, Stack, Typography } from "@mui/material";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import QRSelect from "../common/input/QRSelect";
import QRTextField from "../common/input/QRTextField";
import ClearFiltersButton from "./ClearFiltersButton";

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

const DASHBOARD_STICKY_OFFSET = {
    xs: "120px",
    md: "130px",
};

const TABLE_GRID_COLUMNS = (canManageTables: boolean) =>
    canManageTables
        ? "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr) 160px"
        : "minmax(120px, 1.2fr) minmax(150px, 1.5fr) minmax(175px, 1.3fr)";

function TableHeader({
    canManageTables,
    t,
}: {
    canManageTables: boolean;
    t: ReturnType<typeof useTranslation>["t"];
}) {
    return (
        <Box
            sx={{
                display: {
                    xs: "none",
                    sm: "grid",
                },
                gridTemplateColumns: TABLE_GRID_COLUMNS(canManageTables),
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 1.5,
                minHeight: 52,
                boxSizing: "border-box",
                borderBottom: "1px solid var(--color-border)",
                bgcolor: "var(--color-table-header-bg)",
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
    );
}

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

    const hasSearch = search.trim().length > 0;
    const hasStatusFilter = statusFilter !== "all";
    const hasFilters = hasSearch || hasStatusFilter;

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    const statusFilterLabel = STATUS_FILTER_OPTIONS.find(
        (option) => option.value === statusFilter,
    );

    return (
        <Box sx={{ minWidth: 0, minHeight: 0 }}>
            <Box
                sx={{
                    ...cardSx,
                    p: 0,
                    mt: 2,
                    position: "sticky",
                    top: DASHBOARD_STICKY_OFFSET,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    minHeight: 0,
                    height:
                        data.length > 0
                            ? {
                                  xs: "calc(100dvh - 200px)",
                                  md: "calc(100dvh - 190px)",
                              }
                            : "auto",
                    overflow: "hidden",
                }}
            >
                {data.length > 0 && (
                    <Box
                        sx={{
                            flexShrink: 0,
                            zIndex: 1,
                            bgcolor: "var(--color-surface)",
                            borderRadius: "16px 16px 0 0",
                        }}
                    >
                        <Box
                            sx={{
                                px: { xs: 2, sm: 2.5 },
                                pt: { xs: 2, sm: 2.5 },
                                pb: 2,
                                bgcolor: "var(--color-surface)",
                                borderRadius: "16px 16px 0 0",
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: {
                                        xs: "column",
                                        md: "row",
                                    },
                                    alignItems: {
                                        xs: "stretch",
                                        md: "center",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                <QRTextField
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder={t(
                                        "table",
                                        "searchTablePlaceholder",
                                    )}
                                    aria-label={t(
                                        "table",
                                        "searchTableAriaLabel",
                                    )}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    <Search size={17} />
                                                </Box>
                                            ),
                                        },
                                    }}
                                />

                                <Box
                                    sx={{
                                        width: {
                                            xs: "100%",
                                            md: 230,
                                        },
                                        flexShrink: 0,
                                    }}
                                >
                                    <QRSelect
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target
                                                    .value as TableStatusFilter,
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
                                    mt: 2,
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    justifyContent: "space-between",
                                    gap: 1.25,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    {t("table", "showing")}{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            color: "var(--color-text-primary)",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {filteredTables.length}
                                    </Box>{" "}
                                    / {data.length}{" "}
                                    {locale === "en"
                                        ? data.length === 1
                                            ? "table"
                                            : "tables"
                                        : "bàn"}
                                </Typography>

                                {hasFilters && (
                                    <Stack
                                        sx={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}
                                    >
                                        {hasSearch && (
                                            <Stack
                                                sx={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    flexWrap: "nowrap",
                                                    gap: 0.75,
                                                    minWidth: 0,
                                                    maxWidth: "100%",
                                                    px: 1,
                                                    py: 0.75,
                                                    border: "1px dashed var(--color-border)",
                                                    borderRadius: "9px",
                                                    bgcolor:
                                                        "var(--color-surface)",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        flexShrink: 0,
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        color: "var(--color-text-primary)",
                                                    }}
                                                >
                                                    {t("table", "keyword")}:
                                                </Typography>

                                                <Chip
                                                    size="small"
                                                    label={search.trim()}
                                                    onDelete={() =>
                                                        setSearch("")
                                                    }
                                                    deleteIcon={<X size={13} />}
                                                    sx={{
                                                        ...chipBaseSx,
                                                        height: 24,
                                                        maxWidth: {
                                                            xs: 180,
                                                            sm: 260,
                                                        },
                                                        bgcolor:
                                                            "var(--color-surface-active)",
                                                        "& .MuiChip-label": {
                                                            px: 1,
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        },
                                                        "& .MuiChip-deleteIcon":
                                                            {
                                                                mr: 0.5,
                                                                ml: 0.25,
                                                                fontSize: 14,
                                                                color: "var(--color-text-muted)",
                                                                "&:hover": {
                                                                    color: "var(--color-text-primary)",
                                                                },
                                                            },
                                                    }}
                                                />
                                            </Stack>
                                        )}

                                        {hasStatusFilter &&
                                            statusFilterLabel && (
                                                <Stack
                                                    sx={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        flexWrap: "nowrap",
                                                        gap: 0.75,
                                                        px: 1,
                                                        py: 0.75,
                                                        border: "1px dashed var(--color-border)",
                                                        borderRadius: "9px",
                                                        bgcolor:
                                                            "var(--color-surface)",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            fontSize: 12,
                                                            fontWeight: 700,
                                                            color: "var(--color-text-primary)",
                                                        }}
                                                    >
                                                        {t("table", "status")}:
                                                    </Typography>

                                                    <Chip
                                                        size="small"
                                                        label={t(
                                                            "table",
                                                            statusFilterLabel.labelKey,
                                                        )}
                                                        onDelete={() =>
                                                            setStatusFilter(
                                                                "all",
                                                            )
                                                        }
                                                        deleteIcon={
                                                            <X size={13} />
                                                        }
                                                        sx={{
                                                            ...chipBaseSx,
                                                            height: 24,
                                                            bgcolor:
                                                                "var(--color-surface-active)",
                                                            "& .MuiChip-deleteIcon":
                                                                {
                                                                    mr: 0.5,
                                                                    ml: 0.25,
                                                                    fontSize: 14,
                                                                    color: "var(--color-text-muted)",
                                                                    "&:hover": {
                                                                        color: "var(--color-text-primary)",
                                                                    },
                                                                },
                                                        }}
                                                    />
                                                </Stack>
                                            )}

                                        <ClearFiltersButton
                                            onClick={resetFilters}
                                            label={t("table", "clearFilters")}
                                        />
                                    </Stack>
                                )}
                            </Stack>
                        </Box>

                        {filteredTables.length > 0 && (
                            <TableHeader
                                canManageTables={canManageTables}
                                t={t}
                            />
                        )}
                    </Box>
                )}

                {data.length === 0 ? (
                    <>
                        <Divider sx={dividerSx} />
                        <Box
                            sx={{
                                px: 2,
                                py: 7,
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {t("table", "noTablesYet")}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 13,
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                {t("table", "addFirstTableDescription")}
                            </Typography>
                        </Box>
                    </>
                ) : filteredTables.length === 0 ? (
                    <>
                        <Divider sx={dividerSx} />
                        <Box
                            sx={{
                                px: 2,
                                py: 7,
                                textAlign: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    mx: "auto",
                                    mb: 1.5,
                                    borderRadius: "50%",
                                    display: "grid",
                                    placeItems: "center",
                                    bgcolor: "var(--color-surface-hover)",
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                <Search size={20} />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {t("table", "noMatchingTables")}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 13,
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                {t("table", "changeTableSearchDescription")}
                            </Typography>

                            {hasFilters && (
                                <Box sx={{ mt: 1.5 }}>
                                    <ClearFiltersButton
                                        onClick={resetFilters}
                                        label={t("table", "clearFilters")}
                                        variant="outlined"
                                    />
                                </Box>
                            )}
                        </Box>
                    </>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            minWidth: 0,
                            overflowY: "auto",
                            overflowX: "hidden",
                            overscrollBehaviorY: "contain",
                            WebkitOverflowScrolling: "touch",
                            scrollbarGutter: "stable",
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: "none", sm: "block" },
                                minWidth: 0,
                            }}
                        >
                            {filteredTables.map((table, index) => (
                                <Box key={table.id}>
                                    {index > 0 && <Divider sx={dividerSx} />}

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                TABLE_GRID_COLUMNS(
                                                    canManageTables,
                                                ),
                                            alignItems: "center",
                                            gap: 2,
                                            px: 2.5,
                                            py: 1.75,
                                            minHeight: 68,
                                            transition:
                                                "background-color 150ms ease",
                                            "&:hover": {
                                                bgcolor:
                                                    "var(--color-surface-hover)",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                minWidth: 0,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "var(--color-text-primary)",
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
                                                color: "var(--color-text-secondary)",
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
                                                    justifyContent: "center",
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
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 15,
                                                        fontWeight: 600,
                                                        color: "var(--color-text-primary)",
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
                                                        color: "var(--color-text-secondary)",
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
                    </Box>
                )}
            </Box>
        </Box>
    );
}
