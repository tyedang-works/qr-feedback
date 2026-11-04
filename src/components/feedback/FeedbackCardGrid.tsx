"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

type FeedbackCardGridProps = {
    children: ReactNode;
};

export default function FeedbackCardGrid({ children }: FeedbackCardGridProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                },
                alignItems: "stretch",
                gap: 2,
                width: "100%",
                minWidth: 0,
            }}
        >
            {children}
        </Box>
    );
}
