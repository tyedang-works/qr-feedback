"use client";

import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import {
    FEEDBACK_ISSUES,
    FEEDBACK_STATUS,
    STATUS_CONFIG,
} from "@/lib/feedback/constants";
import type { FeedbackSummary } from "@/lib/feedback/types";
import type { RestaurantTableOption } from "@/lib/tables/queries";
import {
    buttonBaseCancelSx,
    buttonBaseSx,
    chipBaseSx,
} from "@/styles/button.styles";
import { cardSx } from "@/styles/card.styles";

import { useDashboardLoading } from "@/components/dashboard/DashboardLoadingProvider";
import {
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Divider,
    IconButton,
    ListItemText,
    MenuItem,
    CircularProgress as MuiCircularProgress,
    Popover,
    Stack,
    Typography,
} from "@mui/material";
import {
    ChevronDown,
    CircleCheckBig,
    Funnel,
    RotateCcw,
    Search,
    X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FeedbackToolbarProps = {
    keyword: string;
    issues: string[];
    tableId: string;
    status: string;
    tables: RestaurantTableOption[];
    summary: FeedbackSummary;
};

type FilterKey = "keyword" | "issue" | "tableId" | "status";

type FilterOverrides = Partial<Record<FilterKey, string | string[] | null>>;

const SEARCH_DEBOUNCE_MS = 400;

const STATUS_OPTIONS = [
    {
        value: "all",
        label: "Tất cả",
        getCount: (summary: FeedbackSummary) => summary.total,
    },
    {
        value: FEEDBACK_STATUS.NEW,
        label: STATUS_CONFIG[FEEDBACK_STATUS.NEW].label,
        getCount: (summary: FeedbackSummary) => summary.new,
    },
    {
        value: FEEDBACK_STATUS.IN_PROGRESS,
        label: STATUS_CONFIG[FEEDBACK_STATUS.IN_PROGRESS].label,
        getCount: (summary: FeedbackSummary) => summary.inProgress,
    },
    {
        value: FEEDBACK_STATUS.RESOLVED,
        label: STATUS_CONFIG[FEEDBACK_STATUS.RESOLVED].label,
        getCount: (summary: FeedbackSummary) => summary.resolved,
    },
] as const;

export default function FeedbackToolbar({
    keyword,
    issues,
    tableId,
    status,
    tables,
    summary,
}: FeedbackToolbarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [filterAnchorEl, setFilterAnchorEl] =
        useState<HTMLButtonElement | null>(null);

    const [keywordValue, setKeywordValue] = useState(keyword);
    const [filterOpen, setFilterOpen] = useState(false);

    const [draftIssues, setDraftIssues] = useState<string[]>(issues);
    const [draftTableId, setDraftTableId] = useState(tableId || "all");

    const { startNavigation } = useDashboardLoading();
    const isLoading = keywordValue.trim() !== keyword.trim();

    const selectedIssues = FEEDBACK_ISSUES.filter(({ option }) =>
        issues.includes(option),
    );

    const tableLabel = tables.find((table) => table.id === tableId)?.name;

    const activeFilterCount = [issues.length > 0, Boolean(tableId)].filter(
        Boolean,
    ).length;

    useEffect(() => {
        const nextKeyword = keywordValue.trim();
        const currentParams = new URLSearchParams(window.location.search);
        const currentKeyword = currentParams.get("keyword") ?? "";

        if (nextKeyword === currentKeyword) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            const params = new URLSearchParams(window.location.search);

            if (nextKeyword) {
                params.set("keyword", nextKeyword);
            } else {
                params.delete("keyword");
            }

            params.delete("page");

            const query = params.toString();
            const href = query ? `${pathname}?${query}` : pathname;
            startNavigation();
            router.replace(href, { scroll: false });
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [keywordValue, pathname, router, startNavigation]);

    const navigateTo = (href: string) => {
        if (href === `${pathname}${window.location.search}`) {
            return;
        }
        startNavigation();
        router.replace(href, { scroll: false });
    };

    const buildHref = (overrides: FilterOverrides = {}) => {
        const params = new URLSearchParams();

        const values: Record<FilterKey, string | string[] | null> = {
            keyword: keywordValue.trim() || null,
            issue: issues,
            tableId: tableId || null,
            status: status || null,
            ...overrides,
        };

        (Object.keys(values) as FilterKey[]).forEach((key) => {
            const value = values[key];

            if (key === "issue") {
                const issueValues = Array.isArray(value)
                    ? value
                    : typeof value === "string" && value !== "all"
                      ? [value]
                      : [];

                issueValues.forEach((issue) => {
                    if (issue && issue !== "all") {
                        params.append("issue", issue);
                    }
                });

                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item) => {
                    if (item && item !== "all") {
                        params.append(key, item);
                    }
                });

                return;
            }

            if (value && value !== "all") {
                params.set(key, value);
            }
        });

        params.delete("page");

        const query = params.toString();

        return query ? `${pathname}?${query}` : pathname;
    };

    const applyFilters = () => {
        const params = new URLSearchParams(window.location.search);
        const normalizedKeyword = keywordValue.trim();

        if (normalizedKeyword) {
            params.set("keyword", normalizedKeyword);
        } else {
            params.delete("keyword");
        }

        params.delete("issue");

        [...new Set(draftIssues)].forEach((issue) => {
            params.append("issue", issue);
        });

        if (draftTableId && draftTableId !== "all") {
            params.set("tableId", draftTableId);
        } else {
            params.delete("tableId");
        }

        params.delete("page");

        const query = params.toString();

        setFilterOpen(false);
        navigateTo(query ? `${pathname}?${query}` : pathname);
    };

    const clearDraftFilters = () => {
        setDraftIssues([]);
        setDraftTableId("all");
    };

    const clearAllFilters = () => {
        setKeywordValue("");
        setDraftIssues([]);
        setDraftTableId("all");
        setFilterOpen(false);

        navigateTo(pathname);
    };

    const removeFilter = (key: FilterKey) => {
        if (key === "keyword") {
            setKeywordValue("");
            return;
        }

        navigateTo(buildHref({ [key]: null }));
    };

    const openFilters = () => {
        setDraftIssues([...issues]);
        setDraftTableId(tableId || "all");
        setFilterOpen(true);
    };

    const isFilterUnchanged = () => {
        const currentIssues = [...new Set(issues)].sort();
        const nextIssues = [...new Set(draftIssues)].sort();

        return (
            currentIssues.length === nextIssues.length &&
            currentIssues.every(
                (issue, index) => issue === nextIssues[index],
            ) &&
            draftTableId === (tableId || "all")
        );
    };

    return (
        <Card elevation={0} sx={cardSx}>
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.25,
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
                        placeholder="Tìm theo nội dung phản hồi..."
                        value={keywordValue}
                        onChange={(event) =>
                            setKeywordValue(event.target.value)
                        }
                        sx={{
                            "& .MuiOutlinedInput-input": {
                                paddingRight: "44px",
                            },
                        }}
                        slotProps={{
                            htmlInput: {
                                "aria-label": "Tìm kiếm phản hồi",
                                "aria-busy": isLoading,
                            },
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
                                        <Search size={16} />
                                    </Box>
                                ),
                            },
                        }}
                    />

                    {isLoading && (
                        <MuiCircularProgress
                            size={18}
                            thickness={5}
                            aria-label="Đang tìm kiếm phản hồi"
                            sx={{
                                position: "absolute",
                                right: 14,
                                top: "30%",
                                transform: "translateY(-50%)",
                                color: "var(--color-input-focus)",
                                pointerEvents: "none",
                            }}
                        />
                    )}
                </Box>

                <Button
                    ref={setFilterAnchorEl}
                    type="button"
                    variant="outlined"
                    onClick={() => {
                        if (filterOpen) {
                            setFilterOpen(false);
                        } else {
                            openFilters();
                        }
                    }}
                    startIcon={<Funnel size={16} />}
                    endIcon={
                        <ChevronDown
                            size={16}
                            style={{
                                transform: filterOpen
                                    ? "rotate(180deg)"
                                    : "none",
                                transition: "transform 180ms ease",
                            }}
                        />
                    }
                    sx={{
                        height: 40,
                        px: 1.5,
                        borderRadius: 1.5,
                        borderColor: filterOpen
                            ? "var(--color-input-focus)"
                            : "var(--color-input-border)",
                        color: "var(--color-text-secondary)",
                        bgcolor: filterOpen
                            ? "var(--color-surface-active)"
                            : "transparent",
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        "&:hover": {
                            borderColor: "var(--color-input-border-hover)",
                            bgcolor: "var(--color-surface-hover)",
                        },
                    }}
                >
                    Bộ lọc
                    {activeFilterCount > 0 && (
                        <Box
                            component="span"
                            sx={{
                                ml: 0.75,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: "var(--color-button-primary-bg)",
                                color: "var(--color-button-primary-text)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                            }}
                        >
                            {activeFilterCount}
                        </Box>
                    )}
                </Button>
            </Stack>

            <Popover
                open={filterOpen}
                anchorEl={filterAnchorEl}
                onClose={() => setFilterOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            width: {
                                xs: "calc(100vw - 32px)",
                                sm: 320,
                            },
                            maxWidth: 320,
                            p: 2.5,
                            border: "1px solid var(--color-border)",
                            borderRadius: 2,
                            bgcolor: "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            boxShadow: "var(--shadow-card)",
                            backgroundImage: "none",
                        },
                    },
                }}
            >
                <Stack
                    sx={{
                        mb: 2,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Bộ lọc phản hồi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: 12,
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            Thu hẹp kết quả theo vấn đề và bàn.
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        aria-label="Đóng bộ lọc"
                        onClick={() => setFilterOpen(false)}
                        sx={{
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </Stack>

                <Divider
                    sx={{
                        mb: 2.5,
                        borderColor: "var(--color-border)",
                    }}
                />

                <Stack sx={{ gap: 2 }}>
                    <QRSelect<string[]>
                        label="Vấn đề"
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
                                ? "Tất cả vấn đề"
                                : `${selected.length} vấn đề đã chọn`
                        }
                        sx={{
                            "& .MuiSelect-select": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                        }}
                    >
                        {FEEDBACK_ISSUES.map(({ option, label }) => (
                            <MenuItem key={option} value={option}>
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
                                    primary={label}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: 14,
                                                whiteSpace: "normal",
                                            },
                                        },
                                    }}
                                />
                            </MenuItem>
                        ))}
                    </QRSelect>

                    <QRSelect
                        label="Bàn"
                        value={draftTableId}
                        onChange={(event) =>
                            setDraftTableId(event.target.value)
                        }
                    >
                        <MenuItem value="all">Tất cả bàn</MenuItem>

                        {tables.map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                    </QRSelect>
                </Stack>

                <Divider
                    sx={{
                        my: 2.5,
                        borderColor: "var(--color-border)",
                    }}
                />

                <Stack
                    sx={{
                        flexDirection: "row",
                        gap: 1,
                    }}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={clearDraftFilters}
                        disabled={isFilterUnchanged()}
                        startIcon={<RotateCcw size={14} />}
                        sx={buttonBaseCancelSx}
                    >
                        Xóa bộ lọc
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={applyFilters}
                        disabled={isFilterUnchanged()}
                        startIcon={<CircleCheckBig size={16} />}
                        sx={buttonBaseSx}
                    >
                        Áp dụng
                    </Button>
                </Stack>
            </Popover>

            <Box sx={{ mt: 2 }}>
                <Typography
                    sx={{
                        mb: 1,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Trạng thái phản hồi
                </Typography>

                <Stack
                    sx={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    {STATUS_OPTIONS.map((option) => {
                        const selected =
                            option.value === "all"
                                ? !status
                                : status === option.value;

                        const count = option.getCount(summary);

                        const colors =
                            option.value === "all"
                                ? undefined
                                : STATUS_CONFIG[option.value];

                        return (
                            <Chip
                                key={option.value}
                                clickable
                                onClick={() =>
                                    navigateTo(
                                        buildHref({
                                            status:
                                                option.value === "all"
                                                    ? null
                                                    : option.value,
                                        }),
                                    )
                                }
                                label={`${option.label} · ${count}`}
                                size="small"
                                sx={{
                                    height: 32,
                                    borderRadius: 1.5,
                                    fontSize: 12,
                                    fontWeight: selected ? 600 : 500,
                                    border: "1px solid",
                                    borderColor: selected
                                        ? (colors?.borderColor ??
                                          "var(--color-border)")
                                        : "var(--color-border)",
                                    color: selected
                                        ? (colors?.color ??
                                          "var(--color-text-primary)")
                                        : "var(--color-text-secondary)",
                                    bgcolor: selected
                                        ? (colors?.backgroundColor ??
                                          "var(--color-surface-active)")
                                        : "transparent",
                                    transition:
                                        "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
                                    "&:hover": {
                                        borderColor: selected
                                            ? (colors?.borderColor ??
                                              "var(--color-border)")
                                            : "var(--color-text-muted)",
                                        bgcolor: selected
                                            ? (colors?.backgroundColor ??
                                              "var(--color-surface-active)")
                                            : "var(--color-surface-hover)",
                                    },
                                    "& .MuiChip-label": {
                                        px: 1.5,
                                    },
                                }}
                            />
                        );
                    })}
                </Stack>
            </Box>

            {(keywordValue.trim() || issues.length > 0 || tableId) && (
                <>
                    <Divider
                        sx={{
                            my: 1.75,
                            borderColor: "var(--color-border)",
                        }}
                    />

                    <Stack
                        sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            Đang lọc:
                        </Typography>

                        {keywordValue.trim() && (
                            <Chip
                                size="small"
                                label={`Từ khóa: ${keywordValue.trim()}`}
                                onDelete={() => removeFilter("keyword")}
                                deleteIcon={<X size={16} />}
                                sx={chipBaseSx}
                            />
                        )}

                        {issues.length > 0 && (
                            <Chip
                                size="small"
                                label={`Vấn đề: ${
                                    selectedIssues
                                        .map(({ label }) => label)
                                        .join(", ") ||
                                    `${issues.length} đã chọn`
                                }`}
                                onDelete={() => removeFilter("issue")}
                                deleteIcon={<X size={16} />}
                                sx={chipBaseSx}
                            />
                        )}

                        {tableId && (
                            <Chip
                                size="small"
                                label={`Bàn: ${tableLabel ?? "Đã chọn"}`}
                                onDelete={() => removeFilter("tableId")}
                                deleteIcon={<X size={16} />}
                                sx={chipBaseSx}
                            />
                        )}

                        <Button
                            size="small"
                            onClick={clearAllFilters}
                            startIcon={<RotateCcw size={12} />}
                            sx={{
                                ml: { xs: 0, sm: "auto" },
                                minWidth: 0,
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "none",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            Xóa tất cả
                        </Button>
                    </Stack>
                </>
            )}
        </Card>
    );
}
