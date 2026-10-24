"use client";

import { Box, Typography } from "@mui/material";
import { Check } from "lucide-react";

import { animatedAvatarRingSx } from "@/styles/avatar.styles";

type FeedbackSuccessProps = {
    restaurantName: string;
    restaurantLogoUrl: string | null;
};

export default function FeedbackSuccess({
    restaurantName,
    restaurantLogoUrl,
}: FeedbackSuccessProps) {
    return (
        <Box
            sx={{
                position: "relative",
                isolation: "isolate",
                minHeight: "100dvh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                px: { xs: 2, sm: 3 },
                py: { xs: 3, sm: 5 },
                bgcolor: "#F3F7FC",
                color: "#172B45",
                boxSizing: "border-box",
                "& *, & *::before, & *::after": {
                    boxSizing: "border-box",
                },
                "@media (prefers-reduced-motion: reduce)": {
                    "& *, & *::before, & *::after": {
                        animationDuration: "0.01ms !important",
                        animationIterationCount: "1 !important",
                        transitionDuration: "0.01ms !important",
                    },
                },
            }}
        >
            <Box
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    zIndex: -1,
                    width: { xs: 220, sm: 360 },
                    height: { xs: 220, sm: 360 },
                    top: { xs: -130, sm: -180 },
                    right: { xs: -130, sm: -180 },
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle at 35% 65%, rgba(211, 229, 249, 0.38), rgba(222, 235, 250, 0.12) 65%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <Box
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    zIndex: -1,
                    width: { xs: 260, sm: 440 },
                    height: { xs: 260, sm: 440 },
                    bottom: { xs: -180, sm: -250 },
                    left: { xs: -160, sm: -220 },
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle at 65% 35%, rgba(211, 229, 249, 0.38), rgba(222, 235, 250, 0.12) 65%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 550,
                    p: { xs: 3, sm: 4.5, md: 5 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #D8E4F2",
                    borderRadius: { xs: 4, sm: 5 },
                    boxShadow: "0 20px 60px rgba(31, 57, 87, 0.08)",
                    animation: "successCardIn 450ms ease-out both",
                    "@keyframes successCardIn": {
                        from: {
                            opacity: 0,
                            transform: "translateY(12px)",
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        ...animatedAvatarRingSx,
                        width: 86,
                        height: 86,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        mb: 1.5,
                        animation: "successLogoIn 450ms 80ms ease-out both",
                        "@keyframes successLogoIn": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-6px)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >
                    {restaurantLogoUrl ? (
                        <Box
                            component="img"
                            src={restaurantLogoUrl}
                            alt={`Logo ${restaurantName}`}
                            sx={{
                                position: "relative",
                                width: 78,
                                height: 78,
                                borderRadius: "50%",
                                objectFit: "cover",
                                bgcolor: "#FFFFFF",
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                position: "relative",
                                width: 78,
                                height: 78,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "50%",
                                bgcolor: "#F1F5F9",
                                color: "#193B56",
                                fontSize: 24,
                                fontWeight: 700,
                            }}
                        >
                            {restaurantName.trim().charAt(0).toUpperCase() ||
                                "N"}
                        </Box>
                    )}
                </Box>

                <Typography
                    sx={{
                        mb: 3,
                        color: "#111827",
                        fontSize: { xs: 16, sm: 18 },
                        fontWeight: 700,
                        lineHeight: 1.5,
                        overflowWrap: "anywhere",
                    }}
                >
                    {restaurantName || "Nhà hàng"}
                </Typography>

                <Box
                    sx={{
                        position: "relative",
                        width: 144,
                        height: 102,
                        display: "grid",
                        placeItems: "center",
                        mb: 1.5,
                        animation:
                            "successIconIn 500ms 180ms cubic-bezier(.2,.8,.2,1) both",
                        "@keyframes successIconIn": {
                            "0%": {
                                opacity: 0,
                                transform: "scale(0.75)",
                            },
                            "70%": {
                                transform: "scale(1.05)",
                            },
                            "100%": {
                                opacity: 1,
                                transform: "scale(1)",
                            },
                        },
                    }}
                >
                    <Box
                        aria-hidden="true"
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            width: 22,
                            height: 38,
                            transform: "translateY(-50%)",
                        }}
                    >
                        {[0, 1, 2].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    top: `${item * 13}px`,
                                    width: item === 1 ? 19 : 16,
                                    height: 3,
                                    borderRadius: 2,
                                    bgcolor: "#B7EBD0",
                                    transform:
                                        item === 0
                                            ? "rotate(32deg)"
                                            : item === 2
                                              ? "rotate(-32deg)"
                                              : "none",
                                }}
                            />
                        ))}
                    </Box>

                    <Box
                        sx={{
                            width: 102,
                            height: 102,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "50%",
                            bgcolor: "#E8F7EE",
                        }}
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "50%",
                                bgcolor: "#43BD75",
                                boxShadow:
                                    "0 5px 14px rgba(67, 189, 117, 0.18)",
                            }}
                        >
                            <Check
                                size={34}
                                strokeWidth={2.5}
                                color="#FFFFFF"
                            />
                        </Box>
                    </Box>

                    <Box
                        aria-hidden="true"
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            width: 22,
                            height: 38,
                            transform: "translateY(-50%)",
                        }}
                    >
                        {[0, 1, 2].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    position: "absolute",
                                    left: 0,
                                    top: `${item * 13}px`,
                                    width: item === 1 ? 19 : 16,
                                    height: 3,
                                    borderRadius: 2,
                                    bgcolor: "#B7EBD0",
                                    transform:
                                        item === 0
                                            ? "rotate(-32deg)"
                                            : item === 2
                                              ? "rotate(32deg)"
                                              : "none",
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                <Typography
                    component="h1"
                    sx={{
                        mb: 1.5,
                        color: "#172B45",
                        fontWeight: 800,
                        fontSize: { xs: 25, sm: 30 },
                        letterSpacing: "-0.025em",
                        lineHeight: 1.3,
                        animation: "successTextIn 400ms 300ms ease-out both",
                    }}
                >
                    Cảm ơn bạn!
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 360,
                        color: "#64748B",
                        fontSize: { xs: 14, sm: 16 },
                        lineHeight: 1.8,
                        animation: "successTextIn 400ms 380ms ease-out both",
                        "@keyframes successTextIn": {
                            from: {
                                opacity: 0,
                                transform: "translateY(6px)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >
                    Phản hồi của bạn đã được ghi nhận.
                    <br />
                    Chúng tôi sẽ tiếp nhận và xử lý
                    <br />
                    trong thời gian sớm nhất.
                </Typography>

                <Box
                    aria-hidden="true"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75,
                        mt: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 3,
                            borderRadius: 2,
                            bgcolor: "#D7F3E3",
                        }}
                    />
                    <Box
                        sx={{
                            width: 36,
                            height: 3,
                            borderRadius: 2,
                            bgcolor: "#43BD75",
                        }}
                    />
                    <Box
                        sx={{
                            width: 42,
                            height: 3,
                            borderRadius: 2,
                            bgcolor: "#D7F3E3",
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
