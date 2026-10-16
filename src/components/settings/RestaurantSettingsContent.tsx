"use client";

import TabBar from "@/components/common/tab/TabBar";
import RestaurantSettingsForm from "@/components/settings/RestaurantSettingsForm";
import RestaurantBrandingSection from "@/components/settings/RestaurantBrandingSection";
import {
    SETTINGS_TAB,
    type SettingsTabValue,
} from "@/lib/restaurant/constants";
import type { RestaurantSettings } from "@/lib/restaurant/types";
import { Box } from "@mui/material";
import { useState } from "react";

const SETTINGS_TABS = [
    {
        value: SETTINGS_TAB.GENERAL,
        label: "Thông tin chung",
    },
    {
        value: SETTINGS_TAB.BRANDING,
        label: "Nhận diện thương hiệu",
    },
];

type RestaurantSettingsContentProps = {
    initialSettings: RestaurantSettings;
};

export default function RestaurantSettingsContent({
    initialSettings,
}: RestaurantSettingsContentProps) {
    const [activeTab, setActiveTab] = useState<SettingsTabValue>(
        SETTINGS_TAB.GENERAL,
    );

    const handleTabChange = (value: string | number) => {
        if (value === SETTINGS_TAB.GENERAL || value === SETTINGS_TAB.BRANDING) {
            setActiveTab(value);
        }
    };

    return (
        <Box sx={{ width: "100%", minWidth: 0 }}>
            <TabBar
                items={SETTINGS_TABS}
                value={activeTab}
                onChange={handleTabChange}
                ariaLabel="Cài đặt nhà hàng"
                variant="scrollable"
            />

            <Box sx={{ pt: 3, minWidth: 0 }}>
                {activeTab === SETTINGS_TAB.GENERAL && (
                    <RestaurantSettingsForm initialSettings={initialSettings} />
                )}

                {activeTab === SETTINGS_TAB.BRANDING && (
                    <RestaurantBrandingSection
                        initialSettings={initialSettings}
                    />
                )}
            </Box>
        </Box>
    );
}
