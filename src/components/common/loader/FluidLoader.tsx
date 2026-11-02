"use client";

import { useId } from "react";
import { useTranslation } from "@/components/common/providers/useTranslation";
import { Box, Stack, Typography } from "@mui/material";

export default function FluidLoader() {
    const id = useId().replace(/:/g, "");
    const clippingId = `qr-loader-clipping-${id}`;
    const { t } = useTranslation();

    return (
        <Stack
            role="status"
            aria-label={t("dashboard", "comingSoon")}
            sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                textAlign: "center",
            }}
        >
            <Box
                aria-hidden="true"
                sx={{
                    "--color-one": "#ffbf48",
                    "--color-two": "#be4a1d",
                    "--color-three": "#ffbf4780",
                    "--color-four": "#bf4a1d80",
                    "--color-five": "#ffbf4740",
                    "--time-animation": "2s",
                    "--size": 1,

                    position: "relative",
                    width: 100,
                    height: 100,
                    flexShrink: 0,
                    borderRadius: "50%",
                    transform: "scale(var(--size))",
                    boxShadow:
                        "0 0 25px 0 var(--color-three), 0 20px 50px 0 var(--color-four)",
                    animation:
                        "qrLoaderColorize calc(var(--time-animation) * 3) ease-in-out infinite",

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        borderTop: "1px solid var(--color-one)",
                        borderBottom: "1px solid var(--color-two)",
                        background:
                            "linear-gradient(180deg, var(--color-five), var(--color-four))",
                        boxShadow:
                            "inset 0 10px 10px 0 var(--color-three), inset 0 -10px 10px 0 var(--color-four)",
                    },

                    "& .qr-loader-svg": {
                        position: "absolute",
                        inset: 0,
                        width: 100,
                        height: 100,
                    },

                    "& .qr-loader-mask": {
                        filter: "contrast(15)",
                        animation:
                            "qrLoaderRoundness calc(var(--time-animation) / 2) linear infinite",
                    },

                    "& .qr-loader-mask polygon": {
                        filter: "blur(7px)",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(1)": {
                        transformOrigin: "75% 25%",
                        transform: "rotate(90deg)",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(2)": {
                        transformOrigin: "50% 50%",
                        animation:
                            "qrLoaderRotation var(--time-animation) linear infinite reverse",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(3)": {
                        transformOrigin: "50% 60%",
                        animation:
                            "qrLoaderRotation var(--time-animation) linear infinite",
                        animationDelay: "calc(var(--time-animation) / -3)",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(4)": {
                        transformOrigin: "40% 40%",
                        animation:
                            "qrLoaderRotation var(--time-animation) linear infinite reverse",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(5)": {
                        transformOrigin: "40% 40%",
                        animation:
                            "qrLoaderRotation var(--time-animation) linear infinite reverse",
                        animationDelay: "calc(var(--time-animation) / -2)",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(6)": {
                        transformOrigin: "60% 40%",
                        animation:
                            "qrLoaderRotation var(--time-animation) linear infinite",
                    },

                    "& .qr-loader-mask polygon:nth-of-type(7)": {
                        transformOrigin: "60% 40%",
                        animation:
                            "qrLoaderRotation var(--time-animation) linear infinite",
                        animationDelay: "calc(var(--time-animation) / -1.5)",
                    },

                    "@keyframes qrLoaderRotation": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                    },

                    "@keyframes qrLoaderRoundness": {
                        "0%, 60%, 100%": { filter: "contrast(15)" },
                        "20%, 40%": { filter: "contrast(3)" },
                    },

                    "@keyframes qrLoaderColorize": {
                        "0%, 100%": { filter: "hue-rotate(0deg)" },
                        "20%": { filter: "hue-rotate(-30deg)" },
                        "40%": { filter: "hue-rotate(-60deg)" },
                        "60%": { filter: "hue-rotate(-90deg)" },
                        "80%": { filter: "hue-rotate(-45deg)" },
                    },

                    "@media (prefers-reduced-motion: reduce)": {
                        animation: "none",
                        "& .qr-loader-mask": {
                            animation: "none",
                        },
                        "& .qr-loader-mask polygon": {
                            animation: "none",
                            filter: "blur(7px)",
                        },
                    },
                }}
            >
                <svg
                    className="qr-loader-svg"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                >
                    <defs>
                        <mask id={clippingId} className="qr-loader-mask">
                            <polygon
                                points="0,0 100,0 100,100 0,100"
                                fill="black"
                            />
                            <polygon points="25,25 75,25 50,75" fill="white" />
                            <polygon points="50,25 75,75 25,75" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                        </mask>
                    </defs>
                </svg>

                <Box
                    sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        background:
                            "linear-gradient(180deg, var(--color-one) 30%, var(--color-two) 70%)",
                        mask: `url(#${clippingId})`,
                        WebkitMask: `url(#${clippingId})`,
                    }}
                />
            </Box>

            <Box>
                <Typography
                    sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                    }}
                >
                    {t("dashboard", "productName")}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {t("dashboard", "comingSoon")}
                </Typography>
            </Box>
        </Stack>
    );
}
