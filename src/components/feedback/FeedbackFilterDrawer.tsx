"use client";

import QRSelect from "@/components/common/input/QRSelect";
import { useTranslation } from "@/components/common/providers/useTranslation";
import { FEEDBACK_ISSUES } from "@/lib/feedback/constants";
import type { RestaurantTableOption } from "@/lib/tables/queries";
import { useState } from "react";

import {
    Box,
    Button,
    Checkbox,
    Divider,
    Drawer,
    IconButton,
    ListItemText,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";

import { RotateCcw, X } from "lucide-react";

import { buttonBaseSx } from "@/styles/button.styles";
import QRDatePicker from "../common/input/QRDatePicker";

type FeedbackFilterDrawerProps = {
    open: boolean;
    issues: string[];
    tableIds: string[];
    startDate: string;
    endDate: string;
    tables: RestaurantTableOption[];
    onClose: () => void;
    onApply: (filters: {
        issues: string[];
        tableIds: string[];
        startDate: string;
        endDate: string;
    }) => void;
};

const ISSUE_TRANSLATION_KEYS: Record<string, string> = {
    food_quality: "foodQuality",
    food_presentation: "foodPresentation",
    service: "serviceIssue",
    space_cleanliness: "spaceCleanliness",
    service_time: "serviceTime",
};

export default function FeedbackFilterDrawer({
    open,
    issues,
    tableIds,
    startDate,
    endDate,
    tables,
    onClose,
    onApply,
}: FeedbackFilterDrawerProps) {
    const { t } = useTranslation();

    const [draftIssues, setDraftIssues] = useState<string[]>(issues);
    const [draftTableIds, setDraftTableIds] = useState<string[]>(tableIds);
    const [draftStartDate, setDraftStartDate] = useState(startDate);
    const [draftEndDate, setDraftEndDate] = useState(endDate);
    const [dateErrors, setDateErrors] = useState({ start: false, end: false });

    const [previousOpen, setPreviousOpen] = useState(open);

    if (open && !previousOpen) {
        setPreviousOpen(true);
        setDraftIssues([...issues]);
        setDraftTableIds([...tableIds]);
        setDraftStartDate(startDate);
        setDraftEndDate(endDate);
        setDateErrors({ start: false, end: false });
    } else if (!open && previousOpen) {
        setPreviousOpen(false);
    }

    const isUnchanged =
        JSON.stringify([...draftIssues].sort()) ===
            JSON.stringify([...issues].sort()) &&
        JSON.stringify([...draftTableIds].sort()) ===
            JSON.stringify([...tableIds].sort()) &&
        draftStartDate === startDate &&
        draftEndDate === endDate;

    const hasDraftFilters =
        draftIssues.length > 0 ||
        draftTableIds.length > 0 ||
        Boolean(draftStartDate) ||
        Boolean(draftEndDate);

    const getIssueLabel = (option: string, fallbackLabel: string) => {
        const translationKey = ISSUE_TRANSLATION_KEYS[option];

        return translationKey ? t("dashboard", translationKey) : fallbackLabel;
    };

    const resetFilters = () => {
        setDraftIssues([]);
        setDraftTableIds([]);
        setDraftStartDate("");
        setDraftEndDate("");
        setDateErrors({ start: false, end: false });
    };

    const hasDateError = dateErrors.start || dateErrors.end;

    const applyFilters = () => {
        if (hasDateError) return;

        onApply({
            issues: [...new Set(draftIssues)],
            tableIds: [...new Set(draftTableIds)],
            startDate: draftStartDate,
            endDate: draftEndDate,
        });
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            transitionDuration={{
                enter: 250,
                exit: 200,
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "90%", sm: 340 },
                        maxWidth: "90%",
                        p: 3,
                        bgcolor: "var(--color-surface)",
                        color: "var(--color-text-primary)",
                        backgroundImage: "none",
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                }}
            >
                <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                        {t("feedbackToolbar", "filters")}
                    </Typography>
                </Box>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 0,
                    }}
                >
                    <IconButton
                        onClick={resetFilters}
                        disabled={!hasDraftFilters}
                        aria-label={t("feedbackToolbar", "clearFilters")}
                        sx={{
                            width: 38,
                            height: 38,
                            position: "relative",
                            color: "var(--color-text-secondary)",
                            "&.Mui-disabled": {
                                color: "var(--color-text-muted)",
                            },
                        }}
                    >
                        <RotateCcw size={17} />

                        {hasDraftFilters && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: "#f97316",
                                    border: "1px solid var(--color-surface)",
                                }}
                            />
                        )}
                    </IconButton>

                    <IconButton
                        onClick={onClose}
                        aria-label={t("feedbackToolbar", "closeFilters")}
                        sx={{ color: "var(--color-text-secondary)" }}
                    >
                        <X size={20} />
                    </IconButton>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: "var(--color-border)" }} />

            <Stack sx={{ gap: 2.5, flex: 1 }}>
                <QRDatePicker
                    label={t("feedbackToolbar", "startDate")}
                    value={draftStartDate}
                    onChange={setDraftStartDate}
                    maxDate={draftEndDate || undefined}
                    onError={(error) =>
                        setDateErrors((current) => ({
                            ...current,
                            start: error !== null,
                        }))
                    }
                />

                <QRDatePicker
                    label={t("feedbackToolbar", "endDate")}
                    value={draftEndDate}
                    onChange={setDraftEndDate}
                    minDate={draftStartDate || undefined}
                    onError={(error) =>
                        setDateErrors((current) => ({
                            ...current,
                            end: error !== null,
                        }))
                    }
                />

                <QRSelect<string[]>
                    label={t("feedbackToolbar", "issue")}
                    multiple
                    value={draftIssues}
                    onChange={(event) => {
                        const value = event.target.value;

                        setDraftIssues(
                            typeof value === "string"
                                ? value.split(",")
                                : value,
                        );
                    }}
                    displayEmpty
                    renderValue={(selected) =>
                        selected.length === 0
                            ? t("feedbackToolbar", "allIssues")
                            : t(
                                  "feedbackToolbar",
                                  "selectedIssuesCount",
                              ).replace("{count}", String(selected.length))
                    }
                >
                    {FEEDBACK_ISSUES.map(({ option, label }) => (
                        <MenuItem
                            key={option}
                            value={option}
                            sx={{ fontSize: 13 }}
                        >
                            <Checkbox
                                checked={draftIssues.includes(option)}
                                size="small"
                                sx={{
                                    p: 0.5,
                                    mr: 1,
                                    color: "var(--color-text-muted)",
                                    "&.Mui-checked": {
                                        color: "var(--color-input-focus)",
                                    },
                                }}
                            />

                            <ListItemText
                                primary={getIssueLabel(option, label)}
                                slotProps={{
                                    primary: {
                                        sx: { fontSize: 13 },
                                    },
                                }}
                            />
                        </MenuItem>
                    ))}
                </QRSelect>

                <QRSelect<string[]>
                    label={t("feedbackToolbar", "table")}
                    multiple
                    value={draftTableIds}
                    onChange={(event) => {
                        const value = event.target.value;

                        setDraftTableIds(
                            typeof value === "string"
                                ? value.split(",")
                                : value,
                        );
                    }}
                    displayEmpty
                    renderValue={(selected) =>
                        selected.length === 0
                            ? t("feedbackToolbar", "allTables")
                            : t(
                                  "feedbackToolbar",
                                  "selectedTablesCount",
                              ).replace("{count}", String(selected.length))
                    }
                >
                    {tables.map(({ id, name }) => (
                        <MenuItem key={id} value={id} sx={{ fontSize: 13 }}>
                            <Checkbox
                                checked={draftTableIds.includes(id)}
                                size="small"
                                sx={{
                                    p: 0.5,
                                    mr: 1,
                                    color: "var(--color-text-muted)",
                                    "&.Mui-checked": {
                                        color: "var(--color-input-focus)",
                                    },
                                }}
                            />

                            <ListItemText
                                primary={name}
                                slotProps={{
                                    primary: {
                                        sx: { fontSize: 13 },
                                    },
                                }}
                            />
                        </MenuItem>
                    ))}
                </QRSelect>
            </Stack>

            <Divider sx={{ my: 2.5, borderColor: "var(--color-border)" }} />

            <Stack sx={{ flexDirection: "row", gap: 1.5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={applyFilters}
                    disabled={isUnchanged || hasDateError}
                    sx={buttonBaseSx}
                >
                    {t("feedbackToolbar", "applyFilters")}
                </Button>
            </Stack>
        </Drawer>
    );
}
