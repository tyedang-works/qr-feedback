"use client";

import QRSelect from "@/components/common/input/QRSelect";
import QRTextField from "@/components/common/input/QRTextField";
import { FEEDBACK_ISSUES, FEEDBACK_STATUS } from "@/lib/feedback/constants";
import type { FeedbackSummary } from "@/lib/feedback/types";
import type { RestaurantTableOption } from "@/lib/tables/queries";
import {
    buttonBaseCancelSx,
    buttonBaseSx,
    chipBaseSx,
} from "@/styles/button.styles";

import {
    faCheck,
    faChevronDown,
    faFilter,
    faMagnifyingGlass,
    faRotateLeft,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    Button,
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

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
        label: "Chưa xử lý",
        getCount: (summary: FeedbackSummary) => summary.new,
    },
    {
        value: FEEDBACK_STATUS.IN_PROGRESS,
        label: "Đang xử lý",
        getCount: (summary: FeedbackSummary) => summary.inProgress,
    },
    {
        value: FEEDBACK_STATUS.RESOLVED,
        label: "Đã xử lý",
        getCount: (summary: FeedbackSummary) => summary.resolved,
    },
] as const;

const STATUS_COLORS: Record<
    string,
    { color: string; backgroundColor: string }
> = {
    [FEEDBACK_STATUS.NEW]: {
        color: "#B54708",
        backgroundColor: "#FFF4E5",
    },
    [FEEDBACK_STATUS.IN_PROGRESS]: {
        color: "#175CD3",
        backgroundColor: "#EFF8FF",
    },
    [FEEDBACK_STATUS.RESOLVED]: {
        color: "#027A48",
        backgroundColor: "#ECFDF3",
    },
};

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

    const [isPending, startTransition] = useTransition();
    const [keywordValue, setKeywordValue] = useState(keyword);
    const [filterOpen, setFilterOpen] = useState(false);

    const [draftIssues, setDraftIssues] = useState<string[]>(issues);
    const [draftTableId, setDraftTableId] = useState(tableId || "all");

    const isLoading = isPending || keywordValue.trim() !== keyword.trim();

    const selectedIssues = FEEDBACK_ISSUES.filter(({ option }) =>
        issues.includes(option),
    );

    const tableLabel = tables.find((table) => table.id === tableId)?.name;

    // Đếm nhóm filter đang hoạt động, không đếm từng vấn đề riêng lẻ.
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

            startTransition(() => {
                router.replace(href, { scroll: false });
            });
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [keywordValue, pathname, router]);

    const navigateTo = (href: string) => {
        startTransition(() => {
            router.replace(href, { scroll: false });
        });
    };

    /**
     * Tạo URL từ bộ filter hiện tại và các giá trị được override.
     * Riêng issue có thể là mảng và được thêm bằng params.append().
     */
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

        // Xóa toàn bộ issue cũ trước khi thêm các lựa chọn mới.
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
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
                p: { xs: 1.5, sm: 2 },
                bgcolor: "#FFFFFF",
                border: "1px solid #EAECF0",
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.04)",
            }}
        >
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
                                            color: "#98A2B3",
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faMagnifyingGlass}
                                            style={{ fontSize: 15 }}
                                        />
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
                                color: "#1976D2",
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
                    startIcon={<FontAwesomeIcon icon={faFilter} />}
                    endIcon={
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            style={{
                                fontSize: 11,
                                transform: filterOpen
                                    ? "rotate(180deg)"
                                    : "none",
                                transition: "transform 180ms ease",
                            }}
                        />
                    }
                    sx={{
                        height: 40,
                        px: 1.75,
                        borderRadius: 1.5,
                        borderColor: filterOpen ? "#193B56" : "#D0D5DD",
                        color: "#344054",
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
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
                                bgcolor: "#193B56",
                                color: "#FFFFFF",
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
                            border: "1px solid #EAECF0",
                            borderRadius: 2,
                            boxShadow: "0 12px 28px rgba(16, 24, 40, 0.14)",
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
                                color: "#193B56",
                            }}
                        >
                            Bộ lọc phản hồi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: 12,
                                color: "#667085",
                            }}
                        >
                            Thu hẹp kết quả theo vấn đề và bàn.
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        aria-label="Đóng bộ lọc"
                        onClick={() => setFilterOpen(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                </Stack>

                <Divider sx={{ mb: 2.5, borderColor: "#EAECF0" }} />

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
                                        color: "#98A2B3",
                                        "&.Mui-checked": {
                                            color: "#193B56",
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

                <Divider sx={{ my: 2.5, borderColor: "#EAECF0" }} />

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
                        startIcon={
                            <FontAwesomeIcon
                                icon={faRotateLeft}
                                style={{ fontSize: 14 }}
                            />
                        }
                        sx={buttonBaseCancelSx}
                    >
                        Xóa bộ lọc
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={applyFilters}
                        disabled={isFilterUnchanged()}
                        startIcon={
                            <FontAwesomeIcon
                                icon={faCheck}
                                style={{ fontSize: 14 }}
                            />
                        }
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
                        color: "#667085",
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
                        const colors = STATUS_COLORS[option.value];

                        return (
                            <Chip
                                key={option.value}
                                component={Link}
                                href={buildHref({
                                    status:
                                        option.value === "all"
                                            ? null
                                            : option.value,
                                })}
                                clickable
                                label={`${option.label} · ${count}`}
                                size="small"
                                sx={{
                                    height: 32,
                                    borderRadius: 1.5,
                                    fontSize: 12,
                                    fontWeight: selected ? 600 : 500,
                                    border: "1px solid",
                                    borderColor: selected
                                        ? "#193B56"
                                        : "#EAECF0",
                                    color: selected
                                        ? "#FFFFFF"
                                        : (colors?.color ?? "#475467"),
                                    bgcolor: selected
                                        ? "#193B56"
                                        : (colors?.backgroundColor ??
                                          "#FFFFFF"),
                                    "&:hover": {
                                        bgcolor: selected
                                            ? "#244E6C"
                                            : "#F9FAFB",
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
                            borderColor: "#F2F4F7",
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
                                color: "#667085",
                            }}
                        >
                            Đang lọc:
                        </Typography>

                        {keywordValue.trim() && (
                            <Chip
                                size="small"
                                label={`Từ khóa: ${keywordValue.trim()}`}
                                onDelete={() => removeFilter("keyword")}
                                deleteIcon={<FontAwesomeIcon icon={faXmark} />}
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
                                deleteIcon={<FontAwesomeIcon icon={faXmark} />}
                                sx={chipBaseSx}
                            />
                        )}

                        {tableId && (
                            <Chip
                                size="small"
                                label={`Bàn: ${tableLabel ?? "Đã chọn"}`}
                                onDelete={() => removeFilter("tableId")}
                                deleteIcon={<FontAwesomeIcon icon={faXmark} />}
                                sx={chipBaseSx}
                            />
                        )}

                        <Button
                            size="small"
                            onClick={clearAllFilters}
                            startIcon={
                                <FontAwesomeIcon
                                    icon={faRotateLeft}
                                    size="sm"
                                    style={{ fontSize: "12px" }}
                                />
                            }
                            sx={{
                                ml: { xs: 0, sm: "auto" },
                                minWidth: 0,
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "none",
                                color: "#475467",
                            }}
                        >
                            Xóa tất cả
                        </Button>
                    </Stack>
                </>
            )}
        </Box>
    );
}
