"use client";

import { ThemeProvider } from "@mui/material/styles";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useSyncExternalStore,
    type ReactNode,
} from "react";

import { createAppTheme, type ThemeMode } from "@/styles/theme";

type ThemeModeContextValue = {
    mode: ThemeMode;
    toggleMode: () => void;
};

type MuiThemeProviderProps = {
    children: ReactNode;
};

const STORAGE_KEY = "qr-feedback-theme";
const THEME_CHANGE_EVENT = "qr-feedback-theme-change";

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function getThemeMode(): ThemeMode {
    if (typeof window === "undefined") {
        return "light";
    }

    return window.localStorage.getItem(STORAGE_KEY) === "dark"
        ? "dark"
        : "light";
}

function getServerThemeMode(): ThemeMode {
    return "light";
}

function subscribeToThemeMode(callback: () => void) {
    window.addEventListener(THEME_CHANGE_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(THEME_CHANGE_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

function updateThemeMode(mode: ThemeMode) {
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function useThemeMode() {
    const context = useContext(ThemeModeContext);

    if (!context) {
        throw new Error("useThemeMode must be used within MuiThemeProvider");
    }

    return context;
}

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
    const mode = useSyncExternalStore(
        subscribeToThemeMode,
        getThemeMode,
        getServerThemeMode,
    );

    useEffect(() => {
        document.documentElement.dataset.theme = mode;
    }, [mode]);

    const toggleMode = useCallback(() => {
        const nextMode: ThemeMode =
            getThemeMode() === "light" ? "dark" : "light";

        updateThemeMode(nextMode);
    }, []);

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const contextValue = useMemo(
        () => ({ mode, toggleMode }),
        [mode, toggleMode],
    );

    return (
        <ThemeModeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeModeContext.Provider>
    );
}
