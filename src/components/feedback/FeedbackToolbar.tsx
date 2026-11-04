"use client";

import QRTextField from "@/components/common/input/QRTextField";
import { useTranslation } from "@/components/common/providers/useTranslation";
import { useDashboardLoading } from "@/components/dashboard/DashboardLoadingProvider";
import FeedbackFilterDrawer from "@/components/feedback/FeedbackFilterDrawer";
import { FEEDBACK_ISSUES, FEEDBACK_STATUS } from "@/lib/feedback/constants";
import type { RestaurantTableOption } from "@/lib/tables/queries";
import { cardSx } from "@/styles/card.styles";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowDownWideNarrow,
    CalendarDays,
    ListFilterPlus,
    Search,
    Trash2,
    X,
} from "lucide-react";

import dayjs from "@/lib/dayjs";
import { FeedbackSummary } from "@/lib/feedback/types";
import { usePathname, useRouter } from "next/navigation";
import TabBar, { TabBarItem } from "../common/tab/TabBar";
import ExportFeedbackButton from "./ExportFeedbackButton";

const formatFilterDate = (date: string) => {
    const parsedDate = dayjs(date, "YYYY-MM-DD", true);

    return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : date;
};

type SortOption = "newest" | "oldest";

type UpdateParams = Partial<{
    keyword: string | null;
    issues: string[];
    tableIds: string[];
    status: string | null;
    startDate: string | null;
    endDate: string | null;
    sort: SortOption;
}>;

const SEARCH_DEBOUNCE_MS = 400;

const STATUS_OPTIONS = [
    { value: "all" },
    { value: FEEDBACK_STATUS.NEW },
    { value: FEEDBACK_STATUS.IN_PROGRESS },
    { value: FEEDBACK_STATUS.RESOLVED },
] as const;

const STATUS_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    all: {
        bg: "var(--color-badge-all-bg)",
        text: "var(--color-badge-all-text)",
    },
    [FEEDBACK_STATUS.NEW]: {
        bg: "var(--color-badge-new-bg)",
        text: "var(--color-badge-new-text)",
    },
    [FEEDBACK_STATUS.IN_PROGRESS]: {
        bg: "var(--color-badge-in-progress-bg)",
        text: "var(--color-badge-in-progress-text)",
    },
    [FEEDBACK_STATUS.RESOLVED]: {
        bg: "var(--color-badge-resolved-bg)",
        text: "var(--color-badge-resolved-text)",
    },
};

const ISSUE_TRANSLATION_KEYS: Record<string, string> = {
    food_quality: "foodQuality",
    food_presentation: "foodPresentation",
    service: "serviceIssue",
    space_cleanliness: "spaceCleanliness",
    service_time: "serviceTime",
};

const activeChipSx = {
    height: 28,
    borderRadius: "8px",
    bgcolor: "var(--color-surface-active)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border)",
    fontSize: 12,
    fontWeight: 400,

    "& .MuiChip-label": {
        px: 1,
    },

    "& .MuiChip-deleteIcon": {
        width: 16,
        height: 16,
        p: "2px",
        ml: 0.5,
        mr: 0.5,
        borderRadius: "50%",
        bgcolor: "var(--color-text-muted)",
        color: "var(--color-surface)",
        fontSize: 12,
        transition: "background-color 150ms ease",

        "&:hover": {
            bgcolor: "var(--color-text-secondary)",
            color: "var(--color-surface)",
        },
    },
};

type FeedbackToolbarProps = {
    keyword: string;
    issues: string[];
    tableIds: string[];
    status: string;
    startDate: string;
    endDate: string;
    sort: SortOption;
    tables: RestaurantTableOption[];
    total: number;
    exportUrl: string;
    exportDisabled: boolean;
    summary: FeedbackSummary;
};

export default function FeedbackToolbar({
    keyword,
    issues,
    tableIds,
    status,
    startDate,
    endDate,
    sort,
    tables,
    total,
    exportUrl,
    exportDisabled,
    summary,
}: FeedbackToolbarProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const { startNavigation } = useDashboardLoading();

    const [keywordValue, setKeywordValue] = useState(keyword);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);

    const isSearching = keywordValue.trim() !== keyword.trim();

    const activeFilterCount = [
        issues.length > 0,
        tableIds.length > 0,
        Boolean(startDate || endDate),
    ].filter(Boolean).length;

    const hasActiveFilters = activeFilterCount > 0;
    const activeStatus = status || "all";

    const selectedIssues = FEEDBACK_ISSUES.filter(({ option }) =>
        issues.includes(option),
    );

    const selectedTables = tables.filter(({ id }) => tableIds.includes(id));

    const sortLabel =
        sort === "oldest"
            ? t("feedback", "oldestFirst")
            : t("feedback", "newestFirst");

    const getIssueLabel = (option: string, fallbackLabel: string) => {
        const translationKey = ISSUE_TRANSLATION_KEYS[option];

        return translationKey ? t("dashboard", translationKey) : fallbackLabel;
    };

    const STATUS_COUNTS: Record<string, number> = {
        all: summary.total,
        [FEEDBACK_STATUS.NEW]: summary.new,
        [FEEDBACK_STATUS.IN_PROGRESS]: summary.inProgress,
        [FEEDBACK_STATUS.RESOLVED]: summary.resolved,
    };

    const dateRangeLabel =
        startDate && endDate
            ? `${formatFilterDate(startDate)} – ${formatFilterDate(endDate)}`
            : startDate
              ? `${t("feedbackToolbar", "startDate")}: ${formatFilterDate(startDate)}`
              : `${t("feedbackToolbar", "endDate")}: ${formatFilterDate(endDate)}`;

    const navigateTo = useCallback(
        (params: URLSearchParams) => {
            params.delete("page");

            const query = params.toString();
            const href = query ? `${pathname}?${query}` : pathname;

            if (href === `${pathname}${window.location.search}`) {
                return;
            }

            startNavigation();
            router.replace(href, { scroll: false });
        },
        [pathname, router, startNavigation],
    );

    const updateParams = useCallback(
        (updates: UpdateParams) => {
            const params = new URLSearchParams(window.location.search);

            if ("keyword" in updates) {
                if (updates.keyword) {
                    params.set("keyword", updates.keyword);
                } else {
                    params.delete("keyword");
                }
            }

            if ("issues" in updates) {
                params.delete("issue");

                updates.issues?.forEach((issue) => {
                    params.append("issue", issue);
                });
            }

            if ("tableIds" in updates) {
                params.delete("tableId");

                updates.tableIds?.forEach((id) => {
                    params.append("tableId", id);
                });
            }

            if ("status" in updates) {
                if (updates.status && updates.status !== "all") {
                    params.set("status", updates.status);
                } else {
                    params.delete("status");
                }
            }

            if ("startDate" in updates) {
                if (updates.startDate) {
                    params.set("startDate", updates.startDate);
                } else {
                    params.delete("startDate");
                }
            }

            if ("endDate" in updates) {
                if (updates.endDate) {
                    params.set("endDate", updates.endDate);
                } else {
                    params.delete("endDate");
                }
            }

            if ("sort" in updates) {
                if (updates.sort && updates.sort !== "newest") {
                    params.set("sort", updates.sort);
                } else {
                    params.delete("sort");
                }
            }

            navigateTo(params);
        },
        [navigateTo],
    );

    useEffect(() => {
        const nextKeyword = keywordValue.trim();
        const currentParams = new URLSearchParams(window.location.search);
        const currentKeyword = currentParams.get("keyword") ?? "";

        if (nextKeyword === currentKeyword) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            updateParams({ keyword: nextKeyword || null });
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [keywordValue, updateParams]);

    const clearAllFilters = () => {
        setKeywordValue("");

        const params = new URLSearchParams(window.location.search);

        params.delete("keyword");
        params.delete("issue");
        params.delete("tableId");
        params.delete("startDate");
        params.delete("endDate");

        navigateTo(params);
    };

    const removeIssue = (issue: string) => {
        updateParams({
            issues: issues.filter((item) => item !== issue),
        });
    };

    const removeTable = (tableId: string) => {
        updateParams({
            tableIds: tableIds.filter((item) => item !== tableId),
        });
    };

    const removeDateFilter = () => {
        updateParams({
            startDate: null,
            endDate: null,
        });
    };

    const renderFilterGroup = (label: string, children: ReactNode) => (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.75,
                px: 1,
                py: 0.75,
                border: "1px dashed var(--color-border)",
                borderRadius: 1.5,
                minHeight: 40,
                bgcolor: "var(--color-surface)",
            }}
        >
            <Typography
                sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    whiteSpace: "nowrap",
                }}
            >
                {label}:
            </Typography>

            {children}
        </Stack>
    );

    const statusTabs: TabBarItem[] = STATUS_OPTIONS.map((option) => {
        const badgeColor = STATUS_BADGE_COLORS[option.value];

        return {
            value: option.value,
            label:
                option.value === "all"
                    ? t("dashboard", "all")
                    : option.value === FEEDBACK_STATUS.NEW
                      ? t("dashboard", "new")
                      : option.value === FEEDBACK_STATUS.IN_PROGRESS
                        ? t("dashboard", "inProgress")
                        : t("dashboard", "resolved"),
            count: STATUS_COUNTS[option.value] ?? 0,
            badgeColor: badgeColor.bg,
            badgeTextColor: badgeColor.text,
        };
    });

    return (
        <Card elevation={0} sx={cardSx}>
            <Stack sx={{ gap: 2 }}>
                <Box sx={{ pb: 1 }}>
                    <TabBar
                        items={statusTabs}
                        value={activeStatus}
                        onChange={(value) => {
                            updateParams({
                                status: value === "all" ? null : String(value),
                            });
                        }}
                        ariaLabel="Feedback status"
                        variant="scrollable"
                        scrollButtons="auto"
                    />
                </Box>

                <Stack
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 1,
                        width: "100%",
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            position: "relative",
                            "& .MuiFormControl-root": {
                                width: "100%",
                            },
                        }}
                    >
                        <QRTextField
                            name="keyword"
                            placeholder={t(
                                "dashboard",
                                "searchFeedbackPlaceholder",
                            )}
                            value={keywordValue}
                            onChange={(event) =>
                                setKeywordValue(event.target.value)
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    pl: 1.5,
                                },
                                "& .MuiOutlinedInput-input": {
                                    pl: 0,
                                    pr: 1,
                                },
                                "& .MuiInputAdornment-positionStart": {
                                    mr: 1,
                                },
                                "& .MuiInputAdornment-positionEnd": {
                                    ml: 0.5,
                                },
                            }}
                            slotProps={{
                                htmlInput: {
                                    "aria-label": t(
                                        "dashboard",
                                        "searchFeedbackAriaLabel",
                                    ),
                                    "aria-busy": isSearching,
                                },
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </InputAdornment>
                                    ),
                                    endAdornment: keywordValue ? (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setKeywordValue("")
                                                }
                                                aria-label={t(
                                                    "dashboard",
                                                    "clearSearch",
                                                )}
                                                edge="end"
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    color: "var(--color-text-muted)",
                                                    "&:hover": {
                                                        color: "var(--color-text-primary)",
                                                        backgroundColor:
                                                            "var(--color-surface-hover)",
                                                    },
                                                }}
                                            >
                                                <X size={15} />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />

                        {isSearching && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    right: 14,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 15,
                                    height: 15,
                                    border: "2px solid var(--color-border)",
                                    borderTopColor: "var(--color-input-focus)",
                                    borderRadius: "50%",
                                    animation:
                                        "feedback-search-spin 0.7s linear infinite",
                                    "@keyframes feedback-search-spin": {
                                        to: {
                                            transform:
                                                "translateY(-50%) rotate(360deg)",
                                        },
                                    },
                                }}
                            />
                        )}
                    </Box>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            flexShrink: 0,
                            minWidth: 0,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => setFilterOpen(true)}
                            startIcon={
                                <Box
                                    component="span"
                                    sx={{
                                        position: "relative",
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <ListFilterPlus size={16} />

                                    {activeFilterCount > 0 && (
                                        <Box
                                            component="span"
                                            sx={{
                                                position: "absolute",
                                                top: -5,
                                                right: -5,
                                                width: 7,
                                                height: 7,
                                                borderRadius: "50%",
                                                bgcolor:
                                                    "var(--color-table-delete)",
                                                border: "1px solid var(--color-surface)",
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                            sx={{
                                height: 42,
                                px: { xs: 1, sm: 1.5 },
                                flex: { xs: 1, sm: "initial" },
                                minWidth: 0,
                                borderRadius: 1.5,
                                borderColor: "var(--color-input-border)",
                                color: "var(--color-text-primary)",
                                fontSize: 13,
                                fontWeight: 600,
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    borderColor:
                                        "var(--color-input-border-hover)",
                                    bgcolor: "var(--color-surface-hover)",
                                },
                            }}
                        >
                            {t("dashboard", "filter")}
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={(event) =>
                                setSortAnchorEl(event.currentTarget)
                            }
                            startIcon={<ArrowDownWideNarrow size={16} />}
                            sx={{
                                height: 42,
                                px: { xs: 1, sm: 1.5 },
                                flex: { xs: 1, sm: "initial" },
                                minWidth: 0,
                                borderRadius: 1.5,
                                borderColor: "var(--color-input-border)",
                                color: "var(--color-text-primary)",
                                fontSize: 13,
                                fontWeight: 500,
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    borderColor:
                                        "var(--color-input-border-hover)",
                                    bgcolor: "var(--color-surface-hover)",
                                },
                            }}
                        >
                            <Box
                                component="span"
                                sx={{ display: { xs: "none", sm: "inline" } }}
                            >
                                {t("feedback", "sortBy")}: {sortLabel}
                            </Box>

                            <Box
                                component="span"
                                sx={{ display: { xs: "inline", sm: "none" } }}
                            >
                                {t("feedback", "sortBy")}
                            </Box>
                        </Button>

                        <Box
                            sx={{
                                flex: { xs: 1, sm: "initial" },
                                minWidth: 0,
                                "& > button": {
                                    width: { xs: "100%", sm: "auto" },
                                    minWidth: { xs: 0, sm: 132 },
                                    px: { xs: 1, sm: 2 },
                                },
                            }}
                        >
                            <ExportFeedbackButton
                                href={exportUrl}
                                disabled={exportDisabled}
                            />
                        </Box>

                        <Menu
                            anchorEl={sortAnchorEl}
                            open={Boolean(sortAnchorEl)}
                            onClose={() => setSortAnchorEl(null)}
                            slotProps={{
                                paper: {
                                    sx: {
                                        mt: 1,
                                        minWidth: 150,
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 1.5,
                                        bgcolor: "var(--color-surface)",
                                        color: "var(--color-text-primary)",
                                        boxShadow: "var(--shadow-card)",
                                        "& .MuiMenuItem-root": {
                                            minHeight: 36,
                                            px: 1.5,
                                            fontSize: 13,
                                            color: "var(--color-text-primary)",
                                        },
                                        "& .MuiMenuItem-root:hover": {
                                            bgcolor:
                                                "var(--color-surface-hover)",
                                        },
                                        "& .MuiMenuItem-root.Mui-selected": {
                                            bgcolor:
                                                "var(--color-surface-active)",
                                            fontWeight: 600,
                                        },
                                        "& .MuiMenuItem-root.Mui-selected:hover":
                                            {
                                                bgcolor:
                                                    "var(--color-surface-active)",
                                            },
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                selected={sort === "newest"}
                                onClick={() => {
                                    setSortAnchorEl(null);
                                    updateParams({ sort: "newest" });
                                }}
                            >
                                {t("feedback", "newestFirst")}
                            </MenuItem>

                            <MenuItem
                                selected={sort === "oldest"}
                                onClick={() => {
                                    setSortAnchorEl(null);
                                    updateParams({ sort: "oldest" });
                                }}
                            >
                                {t("feedback", "oldestFirst")}
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Stack>

                <Typography
                    sx={{ fontSize: 13, color: "var(--color-text-secondary)" }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 700,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {total}
                    </Box>{" "}
                    {t(
                        "feedbackToolbar",
                        total === 1 ? "resultFound" : "resultsFound",
                    ).replace("{count}", "")}
                </Typography>

                {hasActiveFilters && (
                    <>
                        <Divider sx={{ borderColor: "var(--color-border)" }} />

                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1.5,
                            }}
                        >
                            {issues.length > 0 &&
                                renderFilterGroup(
                                    t("dashboard", "issue"),
                                    selectedIssues.map((issue) => (
                                        <Chip
                                            key={issue.option}
                                            size="small"
                                            label={getIssueLabel(
                                                issue.option,
                                                issue.label,
                                            )}
                                            onDelete={() =>
                                                removeIssue(issue.option)
                                            }
                                            deleteIcon={<X size={14} />}
                                            sx={activeChipSx}
                                        />
                                    )),
                                )}

                            {tableIds.length > 0 &&
                                renderFilterGroup(
                                    t("dashboard", "table"),
                                    selectedTables.map((table) => (
                                        <Chip
                                            key={table.id}
                                            size="small"
                                            label={table.name}
                                            onDelete={() =>
                                                removeTable(table.id)
                                            }
                                            deleteIcon={<X size={14} />}
                                            sx={activeChipSx}
                                        />
                                    )),
                                )}
                            {(startDate || endDate) &&
                                renderFilterGroup(
                                    t("feedbackToolbar", "dateRange"),
                                    <Chip
                                        size="small"
                                        icon={<CalendarDays size={14} />}
                                        label={dateRangeLabel}
                                        onDelete={removeDateFilter}
                                        deleteIcon={<X size={14} />}
                                        sx={activeChipSx}
                                    />,
                                )}

                            <Button
                                size="small"
                                onClick={clearAllFilters}
                                startIcon={<Trash2 size={14} />}
                                sx={{
                                    ml: { xs: 0, sm: "auto" },
                                    minWidth: 0,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    color: "var(--color-table-delete)",
                                    "&:hover": {
                                        bgcolor: "var(--bg-table-delete-hover)",
                                    },
                                }}
                            >
                                {t("dashboard", "clearAll")}
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>

            <FeedbackFilterDrawer
                open={filterOpen}
                issues={issues}
                tableIds={tableIds}
                startDate={startDate}
                endDate={endDate}
                tables={tables}
                onClose={() => setFilterOpen(false)}
                onApply={(filters) => {
                    const params = new URLSearchParams(window.location.search);

                    params.delete("issue");
                    [...new Set(filters.issues)].forEach((issue) => {
                        params.append("issue", issue);
                    });

                    params.delete("tableId");
                    [...new Set(filters.tableIds)].forEach((id) => {
                        params.append("tableId", id);
                    });

                    if (filters.startDate) {
                        params.set("startDate", filters.startDate);
                    } else {
                        params.delete("startDate");
                    }

                    if (filters.endDate) {
                        params.set("endDate", filters.endDate);
                    } else {
                        params.delete("endDate");
                    }

                    setFilterOpen(false);
                    navigateTo(params);
                }}
            />
        </Card>
    );
}
