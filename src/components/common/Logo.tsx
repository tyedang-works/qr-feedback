import { Box } from "@mui/material";

type LogoProps = {
    size?: number | string;
    width?: number | string;
    height?: number | string;
};

export default function Logo({ size = 68, width, height }: LogoProps) {
    return (
        <Box
            component="img"
            src="/assets/logo.svg"
            alt="QR Feedback"
            sx={{
                width: width ?? size,
                height: height ?? size,
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
                flexShrink: 0,
                p: 0,
                m: 0,
            }}
        />
    );
}
