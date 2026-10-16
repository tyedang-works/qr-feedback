"use client";

import { Box, Tab, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { LucideIcon } from "lucide-react";

const tabSx = {
    minHeight: 56,
    borderBottom: "1px solid #EAECF0",
    "& .MuiTab-root": {
        minHeight: 56,
        textTransform: "none",
        fontSize: 13,
        fontWeight: 500,
        color: "#667085",
        gap: 1,
    },
    "& .Mui-selected": {
        color: "#193B56 !important",
        fontWeight: 600,
    },
    "& .MuiTabs-indicator": {
        height: 2,
        borderRadius: "2px 2px 0 0",
        bgcolor: "#237A62",
    },
};

export type TabBarItem = {
    value: string | number;
    label: string;
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

                    return (
                        <Tab
                            key={item.value}
                            value={item.value}
                            label={item.label}
                            disabled={item.disabled}
                            icon={Icon ? <Icon size={17} /> : undefined}
                            iconPosition="start"
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
}
