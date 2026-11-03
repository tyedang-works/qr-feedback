import { Box } from "@mui/material";

type SummaryCardDecorationProps = {
    color: string;
};

export default function SummaryCardDecoration({
    color,
}: SummaryCardDecorationProps) {
    return (
        <Box
            aria-hidden="true"
            sx={{
                position: "absolute",
                width: {
                    xs: "145px",
                    sm: "165px",
                    lg: "175px",
                },
                height: {
                    xs: "145px",
                    sm: "165px",
                    lg: "175px",
                },
                right: {
                    xs: "-55px",
                    sm: "-60px",
                    lg: "-65px",
                },
                bottom: {
                    xs: "-105px",
                    sm: "-115px",
                    lg: "-120px",
                },
                borderRadius: {
                    xs: "22px",
                    sm: "26px",
                },
                transform: "rotate(40deg)",
                transformOrigin: "center",
                background: `linear-gradient(
                    135deg,
                    ${color}28 0%,
                    ${color}16 48%,
                    ${color}06 100%
                )`,
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
