import { Box } from "@mui/material";

type LogoProps = {
    size?: number;
};

export default function Logo({
    size = 68,
}: LogoProps) {
    return (
        <Box
            component="img"
            src="/main-logo.svg"
            alt="QR Feedback"
            sx={{
                width: size,
                height: size,
                objectFit: "contain",
                display: "block",
            }}
            
        />
    );
}