import { Box, Stack } from "@mui/material";
import type { ReactNode } from "react";

import PageHeaderSkeleton from "./PageHeaderSkeleton";

type PageLoadingSkeletonProps = {
    children: ReactNode;
    action?: ReactNode;
    titleWidth?: number;
    subtitleWidth?: number;
    gap?: number;
};

export default function PageLoadingSkeleton({
    children,
    action,
    titleWidth,
    subtitleWidth,
    gap = 3,
}: PageLoadingSkeletonProps) {
    return (
        <Stack
            aria-label="Đang tải trang"
            sx={{
                gap: { xs: gap, md: gap + 1 },
                width: "100%",
                minWidth: 0,
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <PageHeaderSkeleton
                        titleWidth={titleWidth}
                        subtitleWidth={subtitleWidth}
                    />
                </Box>

                {action}
            </Stack>

            {children}
        </Stack>
    );
}
