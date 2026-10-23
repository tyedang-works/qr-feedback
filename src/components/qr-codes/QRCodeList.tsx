"use client";

import { Box, Card, Checkbox, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
    getAllQRCodeTablesForBulkPrint,
    getSelectedQRCodeTables,
} from "@/app/dashboard/qr-codes/actions";

import type {
    QRCodeFilters,
    QRCodeListResult,
    QRCodeSelection,
    QRCodeTable,
} from "@/lib/qr-codes/types";

import { cardSx } from "@/styles/card.styles";
import { checkboxStyleSx } from "@/styles/form.styles";
import { tableColumnHeaderSx } from "@/styles/table.styles";
import QRCodeBulkPrintView from "./QRCodeBulkPrintView";
import QRCodePagination from "./QRCodePagination";
import QRCodePreviewButton from "./QRCodePreviewButton";
import QRCodePreviewDialog from "./QRCodePreviewDialog";
import QRCodePrintView from "./QRCodePrintView";
import QRCodeSelectionToolbar from "./QRCodeSelectionToolbar";

function getStatusStyles(isActive: boolean) {
    if (isActive) {
        return {
            label: "Đang hoạt động",
            color: "var(--color-status-success)",
        };
    }

    return {
        label: "Đang tắt",
        color: "var(--color-text-muted)",
    };
}

type QRCodeListProps = {
    result: QRCodeListResult;
    filters: QRCodeFilters;
    onBulkPrintStart: () => void;
    onBulkPrintClose: () => void;
    onPrintModeChange: (isPrinting: boolean) => void;
};

export default function QRCodeList({
    result,
    filters,
    onBulkPrintStart,
    onBulkPrintClose,
    onPrintModeChange,
}: QRCodeListProps) {
    const { data, total, page, pageSize, totalPages, selectableTotal } = result;

    const [selectedTable, setSelectedTable] = useState<QRCodeTable | null>(
        null,
    );

    const [isPrinting, setIsPrinting] = useState(false);

    const [isBulkPrinting, setIsBulkPrinting] = useState(false);

    const [bulkPrintTables, setBulkPrintTables] = useState<
        {
            id: string;
            name: string;
            token: string;
        }[]
    >([]);

    const [loadingBulkPrint, setLoadingBulkPrint] = useState(false);

    const [selection, setSelection] = useState<QRCodeSelection>({
        mode: "manual",
        selectedIds: [],
        excludedIds: [],
    });

    const filterKey = [filters.keyword, filters.status, filters.sort].join("|");

    const previousFilterKeyRef = useRef(filterKey);

    useEffect(() => {
        if (previousFilterKeyRef.current === filterKey) {
            return;
        }

        previousFilterKeyRef.current = filterKey;

        setSelection((currentSelection) => {
            if (currentSelection.mode !== "all") {
                return currentSelection;
            }

            return {
                mode: "manual",
                selectedIds: [],
                excludedIds: [],
            };
        });
    }, [filterKey]);

    const isSelected = (id: string) => {
        if (selection.mode === "all") {
            return !selection.excludedIds.includes(id);
        }

        return selection.selectedIds.includes(id);
    };

    const handleToggleSelection = (id: string) => {
        setSelection((currentSelection) => {
            if (currentSelection.mode === "all") {
                const isExcluded = currentSelection.excludedIds.includes(id);

                return {
                    mode: "all",
                    selectedIds: [],
                    excludedIds: isExcluded
                        ? currentSelection.excludedIds.filter(
                              (excludedId) => excludedId !== id,
                          )
                        : [...currentSelection.excludedIds, id],
                };
            }

            const isCurrentlySelected =
                currentSelection.selectedIds.includes(id);

            return {
                mode: "manual",
                selectedIds: isCurrentlySelected
                    ? currentSelection.selectedIds.filter(
                          (selectedId) => selectedId !== id,
                      )
                    : [...currentSelection.selectedIds, id],
                excludedIds: [],
            };
        });
    };

    const selectableTables = data.filter((table) => table.isActive);

    const selectedOnCurrentPage = selectableTables.filter((table) =>
        isSelected(table.id),
    );

    const allCurrentPageSelected =
        selectableTables.length > 0 &&
        selectedOnCurrentPage.length === selectableTables.length;

    const someCurrentPageSelected =
        selectedOnCurrentPage.length > 0 && !allCurrentPageSelected;

    const handleSelectCurrentPage = () => {
        if (selectableTables.length === 0) {
            return;
        }

        if (selection.mode === "all") {
            if (allCurrentPageSelected) {
                setSelection((currentSelection) => ({
                    mode: "all",
                    selectedIds: [],
                    excludedIds: [
                        ...currentSelection.excludedIds,
                        ...selectableTables
                            .map((table) => table.id)
                            .filter(
                                (id) =>
                                    !currentSelection.excludedIds.includes(id),
                            ),
                    ],
                }));
            } else {
                setSelection((currentSelection) => ({
                    mode: "all",
                    selectedIds: [],
                    excludedIds: currentSelection.excludedIds.filter(
                        (id) =>
                            !selectableTables.some((table) => table.id === id),
                    ),
                }));
            }

            return;
        }

        if (allCurrentPageSelected) {
            setSelection((currentSelection) => ({
                mode: "manual",
                selectedIds: currentSelection.selectedIds.filter(
                    (id) => !selectableTables.some((table) => table.id === id),
                ),
                excludedIds: [],
            }));

            return;
        }

        setSelection((currentSelection) => ({
            mode: "manual",
            selectedIds: [
                ...currentSelection.selectedIds,
                ...selectableTables
                    .map((table) => table.id)
                    .filter((id) => !currentSelection.selectedIds.includes(id)),
            ],
            excludedIds: [],
        }));
    };

    const handleClearSelection = () => {
        setSelection({
            mode: "manual",
            selectedIds: [],
            excludedIds: [],
        });
    };

    const selectedCount =
        selection.mode === "all"
            ? Math.max(selectableTotal - selection.excludedIds.length, 0)
            : selection.selectedIds.length;

    const handleOpenPreview = (table: QRCodeTable) => {
        setSelectedTable(table);
    };

    const handleClosePreview = () => {
        setSelectedTable(null);
    };

    const handlePrint = () => {
        setIsPrinting(true);
        onPrintModeChange(true);
    };

    const handleClosePrint = () => {
        setIsPrinting(false);
        onPrintModeChange(false);
    };

    const handleBulkPrint = async () => {
        if (loadingBulkPrint) {
            return;
        }

        if (selection.mode === "manual" && selection.selectedIds.length === 0) {
            return;
        }

        if (selection.mode === "all" && selectedCount === 0) {
            return;
        }

        setLoadingBulkPrint(true);

        try {
            const tables =
                selection.mode === "all"
                    ? await getAllQRCodeTablesForBulkPrint(
                          filters,
                          selection.excludedIds,
                      )
                    : await getSelectedQRCodeTables(selection.selectedIds);

            if (tables.length === 0) {
                return;
            }

            setBulkPrintTables(tables);
            setIsBulkPrinting(true);
            onBulkPrintStart();
        } catch (error) {
            console.error("Failed to prepare bulk QR print:", error);
        } finally {
            setLoadingBulkPrint(false);
        }
    };

    const handleSelectAll = () => {
        if (selectableTotal === 0) {
            return;
        }

        setSelection({
            mode: "all",
            selectedIds: [],
            excludedIds: [],
        });
    };

    if (isBulkPrinting) {
        return (
            <Box className="qr-bulk-printing">
                <QRCodeBulkPrintView
                    tables={bulkPrintTables}
                    onClose={() => {
                        setIsBulkPrinting(false);
                        setBulkPrintTables([]);
                        onBulkPrintClose();
                    }}
                />
            </Box>
        );
    }

    if (isPrinting && selectedTable) {
        return (
            <QRCodePrintView
                tableName={selectedTable.name}
                tableToken={selectedTable.token}
                onClose={handleClosePrint}
            />
        );
    }

    if (total === 0) {
        return (
            <Card elevation={0} sx={cardSx}>
                <Stack
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        Không tìm thấy bàn
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "var(--color-text-secondary)",
                            textAlign: "center",
                        }}
                    >
                        Không có bàn nào phù hợp với bộ lọc hiện tại.
                    </Typography>
                </Stack>
            </Card>
        );
    }

    return (
        <>
            <Stack sx={{ gap: 2 }}>
                <QRCodeSelectionToolbar
                    selectedCount={selectedCount}
                    selectableTotal={selectableTotal}
                    showSelectAll={
                        selection.mode === "manual" &&
                        selectableTotal > selectedCount
                    }
                    onSelectAll={handleSelectAll}
                    onPrint={handleBulkPrint}
                    onClear={handleClearSelection}
                />

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                        },
                        border: "1px solid var(--color-border)",
                        borderRadius: 2,
                        backgroundColor: "var(--color-surface)",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "48px 1.5fr 1.5fr 1fr 120px",
                            alignItems: "center",
                            minHeight: 56,
                            px: 3,
                            backgroundColor: "var(--color-table-header-bg)",
                            borderBottom: "1px solid var(--color-border)",

                            position: "sticky",
                            top: 0,
                            zIndex: 2,
                        }}
                    >
                        <Checkbox
                            checked={allCurrentPageSelected}
                            indeterminate={someCurrentPageSelected}
                            disabled={selectableTables.length === 0}
                            onChange={handleSelectCurrentPage}
                            size="small"
                            sx={checkboxStyleSx}
                        />

                        <Typography sx={tableColumnHeaderSx}>Bàn</Typography>

                        <Typography sx={tableColumnHeaderSx}>Mã QR</Typography>

                        <Typography sx={tableColumnHeaderSx}>
                            Trạng thái hoạt động
                        </Typography>

                        <Typography
                            sx={{
                                ...tableColumnHeaderSx,
                                textAlign: "right",
                            }}
                        >
                            Thao tác
                        </Typography>
                    </Box>

                    {data.map((table, index) => {
                        const status = getStatusStyles(table.isActive);

                        return (
                            <Box
                                key={table.id}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "48px 1.5fr 1.5fr 1fr 120px",
                                    alignItems: "center",
                                    minHeight: 72,
                                    px: 3,
                                    borderBottom:
                                        index === data.length - 1
                                            ? "none"
                                            : "1px solid var(--color-border)",
                                }}
                            >
                                <Checkbox
                                    checked={
                                        table.isActive && isSelected(table.id)
                                    }
                                    disabled={!table.isActive}
                                    onChange={() =>
                                        handleToggleSelection(table.id)
                                    }
                                    size="small"
                                    sx={checkboxStyleSx}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {table.name}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    {table.token}
                                </Typography>

                                <Box>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 1,
                                            color: status.color,
                                            fontSize: 13,
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                flexShrink: 0,
                                                borderRadius: "50%",
                                                bgcolor: status.color,
                                            }}
                                        />

                                        {status.label}
                                    </Box>
                                </Box>

                                <Stack
                                    sx={{
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <QRCodePreviewButton
                                        onClick={() => handleOpenPreview(table)}
                                    />
                                </Stack>
                            </Box>
                        );
                    })}
                </Box>

                <Stack
                    sx={{
                        display: {
                            xs: "flex",
                            md: "none",
                        },
                        gap: 1.5,
                    }}
                >
                    {data.map((table) => {
                        const status = getStatusStyles(table.isActive);

                        return (
                            <Box
                                key={table.id}
                                sx={{
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 2,
                                    backgroundColor: "var(--color-surface)",
                                    px: 2,
                                    py: 1.75,
                                }}
                            >
                                <Stack
                                    sx={{
                                        gap: 1.5,
                                    }}
                                >
                                    <Stack
                                        sx={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1,
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Checkbox
                                                checked={
                                                    table.isActive &&
                                                    isSelected(table.id)
                                                }
                                                disabled={!table.isActive}
                                                onChange={() =>
                                                    handleToggleSelection(
                                                        table.id,
                                                    )
                                                }
                                                size="small"
                                                sx={checkboxStyleSx}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: "var(--color-text-primary)",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {table.name}
                                            </Typography>
                                        </Stack>

                                        <Box>
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    color: status.color,
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    lineHeight: 1.5,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        flexShrink: 0,
                                                        borderRadius: "50%",
                                                        bgcolor: status.color,
                                                    }}
                                                />

                                                {status.label}
                                            </Box>
                                        </Box>
                                    </Stack>

                                    <Divider
                                        sx={{
                                            borderColor: "var(--color-border)",
                                        }}
                                    />

                                    <Stack
                                        sx={{
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            Mã QR
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "var(--color-text-secondary)",
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            {table.token}
                                        </Typography>
                                    </Stack>

                                    <QRCodePreviewButton
                                        onClick={() => handleOpenPreview(table)}
                                    />
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>

                <QRCodePagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    pageSize={pageSize}
                />
            </Stack>

            <QRCodePreviewDialog
                open={Boolean(selectedTable)}
                tableName={selectedTable?.name ?? ""}
                tableToken={selectedTable?.token ?? ""}
                onClose={handleClosePreview}
                onPrint={handlePrint}
            />
        </>
    );
}
