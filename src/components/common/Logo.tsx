import { Box, Typography } from "@mui/material";

type LogoProps = {
    size?: number;
};

export default function Logo({
    size = 52,
}: LogoProps) {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                backgroundColor: "#1976d2",
                flexShrink: 0,
            }}
        >
            <Typography
                sx={{
                    color: "#fff",
                    fontSize: size * 0.27,
                    fontWeight: 700,
                    lineHeight: 1,
                }}
            >
                LOGO
            </Typography>
        </Box>
    );
}