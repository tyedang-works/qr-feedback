import { Box, Stack, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
    title: string;
    subtitle: string;
    icon: LucideIcon;
};

export default function PageHeader({
    title,
    subtitle,
    icon: Icon,
}: PageHeaderProps) {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                width: "100%",
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--color-border, #F0F2F5)",
                    borderRadius: "16px",
                    bgcolor: "var(--color-surface, #FFFFFF)",
                    boxShadow: "var(--shadow-card)",
                }}
            >
                <Icon size={21} strokeWidth={2} aria-hidden="true" />
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: 18, sm: 20 },
                        lineHeight: 1.4,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#667085",
                    }}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Stack>
    );
}
