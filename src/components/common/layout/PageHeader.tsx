import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";

type PageHeaderProps = {
    title: string;
    subtitle: string;
    icon: IconDefinition;
};

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
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
                    borderRadius: 2.5,
                    bgcolor: "#EAF3F0",
                    color: "#237A62",
                }}
            >
                <FontAwesomeIcon icon={icon} style={{ fontSize: 21 }} />
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
                        mt: 0.5,
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
