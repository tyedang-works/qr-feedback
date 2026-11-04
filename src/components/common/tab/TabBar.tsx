"use client";

import { Box, Tab, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { LucideIcon } from "lucide-react";

const tabSx = {
    minHeight: 48,
    borderBottom: "1px solid var(--color-border)",

    "& .MuiTab-root": {
        minHeight: 48,
        textTransform: "none",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        gap: 1,
        px: 2,
        pt: 1,
        pb: 0,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
        transition: "color 180ms ease",
        "&:hover": {
            color: "var(--color-text-primary)",
            backgroundColor: "transparent",
        },
        "&.Mui-selected": {
            color: "var(--color-tab-selected)",
            fontWeight: 600,
            backgroundColor: "transparent",
        },
        "&.Mui-focusVisible": {
            backgroundColor: "transparent",
        },
        "&.Mui-disabled": {
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
        },
        "&::before": {
            display: "none",
        },
        "& .MuiTab-wrapper": {
            alignItems: "center",
        },
    },
    "& .MuiTabs-indicator": {
        height: 3,
        borderRadius: "999px",
        bgcolor: "var(--color-tab-indicator)",
        transition:
            "left 350ms cubic-bezier(0.22, 1, 0.36, 1), width 350ms cubic-bezier(0.22, 1, 0.36, 1)",
    },
};

export type TabBarItem = {
    value: string | number;
    label: string;
    count?: number;
    badgeColor?: string;
    badgeTextColor?: string;
    badgeInactiveColor?: string;
    badgeInactiveTextColor?: string;
    icon?: LucideIcon;
    disabled?: boolean;
};

type TabBarProps = {
    items: TabBarItem[];
    value: string | number;
    onChange: (value: string | number) => void;
    ariaLabel: string;
    variant?: "standard" | "scrollable" | "fullWidth";
    scrollButtons?: boolean | "auto";
    sx?: SxProps<Theme>;
};

export default function TabBar({
    items,
    value,
    onChange,
    ariaLabel,
    variant = "standard",
    scrollButtons = "auto",
    sx,
}: TabBarProps) {
    return (
        <Box sx={{ width: "100%", minWidth: 0, ...sx }}>
            <Tabs
                value={value}
                onChange={(_, nextValue: string | number) =>
                    onChange(nextValue)
                }
                variant={variant}
                scrollButtons={scrollButtons}
                aria-label={ariaLabel}
                sx={tabSx}
            >
                {items.map((item) => {
                    const Icon = item.icon;
                    const isSelected = value === item.value;

                    return (
                        <Tab
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                            disableRipple
                            icon={Icon ? <Icon size={17} /> : undefined}
                            iconPosition="start"
                            label={
                                <Box
                                    component="span"
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        lineHeight: 1,
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            lineHeight: "22px",
                                        }}
                                    >
                                        {item.label}
                                    </Box>

                                    {item.count !== undefined && (
                                        <Box
                                            component="span"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,

                                                minWidth: 22,
                                                height: 22,
                                                px: 0.75,

                                                borderRadius: "6px",
                                                fontSize: 12,
                                                fontWeight: isSelected
                                                    ? 800
                                                    : 500,
                                                lineHeight: "22px",
                                                textAlign: "center",
                                                fontVariantNumeric:
                                                    "tabular-nums",

                                                color: isSelected
                                                    ? (item.badgeTextColor ??
                                                      "var(--color-text-secondary)")
                                                    : (item.badgeTextColor ??
                                                      "var(--color-text-secondary)"),

                                                backgroundColor:
                                                    item.badgeColor ??
                                                    "var(--color-surface-active)",

                                                transition: [
                                                    "background-color 180ms ease",
                                                    "color 180ms ease",
                                                    "font-weight 180ms ease",
                                                ].join(", "),
                                            }}
                                        >
                                            {item.count}
                                        </Box>
                                    )}
                                </Box>
                            }
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
}
