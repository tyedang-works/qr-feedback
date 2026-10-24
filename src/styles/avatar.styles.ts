import type { SxProps, Theme } from "@mui/material";

export const animatedAvatarRingSx: SxProps<Theme> = {
    position: "relative",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,

    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 190deg, #059669 245deg, #34D399 285deg, #6EE7B7 320deg, transparent 360deg)",
        animation: "avatarGradientSpin 3.5s linear infinite",
        WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
    },

    "@keyframes avatarGradientSpin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
    },

    "@media (prefers-reduced-motion: reduce)": {
        "&::before": {
            animation: "none",
        },
    },
};
