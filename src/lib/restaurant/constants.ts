export const SETTINGS_TAB = {
    GENERAL: "general",
    BRANDING: "branding",
} as const;

export type SettingsTabValue = (typeof SETTINGS_TAB)[keyof typeof SETTINGS_TAB];
