"use client";

import { Box } from "@mui/material";

type DashboardNavigationProgressProps = {
    isLoading: boolean;
};

export default function DashboardNavigationProgress({
    isLoading,
}: DashboardNavigationProgressProps) {
    if (!isLoading) {
        return null;
    }

    return (
        <Box
            aria-label="Đang tải"
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                zIndex: 9999,
                overflow: "hidden",
                pointerEvents: "none",
                backgroundColor: "transparent",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "35%",
                    height: "100%",
                    backgroundColor: "#193B56",
                    borderRadius: "0 2px 2px 0",
                    animation:
                        "dashboardNavigationProgress 1.2s ease-in-out infinite",
                },
                "@keyframes dashboardNavigationProgress": {
                    "0%": {
                        left: "-35%",
                    },
                    "50%": {
                        left: "45%",
                    },
                    "100%": {
                        left: "100%",
                    },
                },
            }}
        />
    );
}
