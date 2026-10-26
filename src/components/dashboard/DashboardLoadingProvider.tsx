"use client";

import { Box, CircularProgress } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

type DashboardLoadingContextValue = {
    startNavigation: () => void;
    runWithLoading: <T>(action: () => Promise<T>) => Promise<T>;
};

const DashboardLoadingContext =
    createContext<DashboardLoadingContextValue | null>(null);

type DashboardLoadingProviderProps = {
    children: ReactNode;
};

export function DashboardLoadingProvider({
    children,
}: DashboardLoadingProviderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

    const [isNavigating, setIsNavigating] = useState(false);
    const [activeActions, setActiveActions] = useState(0);

    const previousUrl = useRef(currentUrl);

    useEffect(() => {
        if (previousUrl.current !== currentUrl) {
            previousUrl.current = currentUrl;
            setIsNavigating(false);
        }
    }, [currentUrl]);

    const startNavigation = useCallback(() => {
        setIsNavigating(true);
    }, []);

    const runWithLoading = useCallback(
        async <T,>(action: () => Promise<T>): Promise<T> => {
            setActiveActions((count) => count + 1);

            try {
                return await action();
            } finally {
                setActiveActions((count) => Math.max(0, count - 1));
            }
        },
        [],
    );

    const isLoading = isNavigating || activeActions > 0;

    return (
        <DashboardLoadingContext.Provider
            value={{ startNavigation, runWithLoading }}
        >
            {children}

            {isLoading && (
                <Box
                    role="status"
                    aria-live="polite"
                    aria-label="Đang tải dữ liệu"
                    sx={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(0.5px)",
                        WebkitBackdropFilter: "blur(0.5px)",
                        pointerEvents: "auto",
                        animation: "dashboardLoadingFadeIn 150ms ease-out",
                        "@keyframes dashboardLoadingFadeIn": {
                            from: { opacity: 0 },
                            to: { opacity: 1 },
                        },
                        "@media (prefers-reduced-motion: reduce)": {
                            animation: "none",
                        },
                    }}
                >
                    <CircularProgress
                        size={38}
                        thickness={3.5}
                        sx={{ color: "#FFFFFF" }}
                    />
                </Box>
            )}
        </DashboardLoadingContext.Provider>
    );
}

export function useDashboardLoading() {
    const context = useContext(DashboardLoadingContext);

    if (!context) {
        throw new Error(
            "useDashboardLoading must be used within DashboardLoadingProvider",
        );
    }

    return context;
}
