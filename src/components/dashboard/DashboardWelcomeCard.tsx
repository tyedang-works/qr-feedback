"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/components/common/providers/useTranslation";
import { cardSx } from "@/styles/card.styles";
import { buttonBaseSx } from "@/styles/button.styles";

type DashboardWelcomeCardProps = {
    fullName: string;
};

export default function DashboardWelcomeCard({
    fullName,
}: DashboardWelcomeCardProps) {
    const { t } = useTranslation();
    const router = useRouter();

    const handleGoNowClick = () => {
        router.push("/dashboard/feedback");
    };

    return (
        <Box
            sx={{
                ...cardSx,
                position: "relative",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                minWidth: 0,
                minHeight: { xs: 340, md: 340 },
                p: { xs: 2.5, sm: 3, md: 4 },
                borderRadius: "18px",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
                isolation: "isolate",
                containerType: "inline-size",

                background:
                    "radial-gradient(ellipse at 82% 18%, rgba(77, 190, 145, 0.10), transparent 34%), linear-gradient(115deg, #F4F5F0 0%, #EEF1EC 58%, #E8EEE8 100%)",
                color: "#202820",

                '[data-theme="dark"] &': {
                    background:
                        "radial-gradient(ellipse at 82% 18%, rgba(48, 151, 112, 0.15), transparent 34%), linear-gradient(115deg, #17211F 0%, #18211F 58%, #1B2924 100%)",
                    color: "var(--color-text-primary)",
                },

                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    zIndex: -1,
                    pointerEvents: "none",
                    background:
                        "linear-gradient(90deg, rgba(255,255,255,0.16), transparent 65%)",
                },
                "@container (max-width: 520px)": {
                    alignItems: "flex-start",
                    minHeight: 380,
                    p: 2.5,

                    "& .welcome-content": {
                        width: "100%",
                        maxWidth: "none",
                        alignSelf: "flex-start",
                        pb: "140px",
                        gap: 1.5,
                    },

                    "& .welcome-illustration": {
                        right: 8,
                        bottom: 4,
                        width: 145,
                        height: 145,
                        opacity: 0.95,
                    },

                    "& .welcome-title": {
                        fontSize: "1.15rem",
                    },

                    "& .welcome-name": {
                        fontSize: "1.55rem",
                    },

                    "& .welcome-description": {
                        maxWidth: "100%",
                        fontSize: "12px",
                        lineHeight: 1.6,
                    },
                },

                "@media (prefers-reduced-motion: reduce)": {
                    "& *": {
                        transition: "none !important",
                        animation: "none !important",
                    },
                },
            }}
        >
            <Stack
                className="welcome-content"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    width: { xs: "100%", sm: "62%", md: "58%" },
                    maxWidth: 560,
                    gap: 2,
                    minWidth: 0,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        className="welcome-title"
                        component="p"
                        sx={{
                            mb: 0.5,
                            fontSize: {
                                xs: "1.25rem",
                                sm: "1.45rem",
                            },
                            lineHeight: 1.35,
                            fontWeight: 700,
                            letterSpacing: "-0.025em",
                            color: "inherit",
                        }}
                    >
                        {t("dashboard", "welcomeBack")} 👋
                    </Typography>

                    <Typography
                        className="welcome-name"
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: "1.55rem",
                                sm: "1.9rem",
                                md: "2.1rem",
                            },
                            lineHeight: 1.2,
                            fontWeight: 750,
                            letterSpacing: "-0.035em",
                            color: "inherit",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {fullName}
                    </Typography>
                </Box>

                <Typography
                    className="welcome-description"
                    sx={{
                        maxWidth: 440,
                        fontSize: {
                            xs: "12px",
                            sm: "14px",
                        },
                        lineHeight: 1.65,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {t("dashboard", "welcomeDescription")}
                </Typography>

                <Button
                    type="button"
                    variant="contained"
                    onClick={handleGoNowClick}
                    disableElevation
                    sx={{
                        ...buttonBaseSx,
                        width: "fit-content",
                    }}
                >
                    {t("dashboard", "goNow")}
                </Button>
            </Stack>

            <Box
                className="welcome-illustration"
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    zIndex: 1,
                    right: {
                        xs: 8,
                        sm: 20,
                        md: 28,
                    },
                    bottom: {
                        xs: -8,
                        sm: 4,
                        md: 8,
                    },
                    width: {
                        xs: 150,
                        sm: 205,
                        md: 245,
                    },
                    height: {
                        xs: 155,
                        sm: 215,
                        md: 250,
                    },
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    pointerEvents: "none",
                }}
            >
                <Box
                    component="img"
                    src="/assets/qr-feedback-dashboard-illustration.svg"
                    alt=""
                    draggable={false}
                    sx={{
                        position: "absolute",
                        left: 0,
                        bottom: {
                            xs: 14,
                            sm: 25,
                            md: 30,
                        },
                        width: {
                            xs: "72%",
                            sm: "76%",
                            md: "78%",
                        },
                        height: "auto",
                        objectFit: "contain",
                    }}
                />

                <Box
                    component="img"
                    src="/assets/qr-feedback-girl-character.svg"
                    alt=""
                    draggable={false}
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: {
                            xs: "48%",
                            sm: "48%",
                            md: "49%",
                        },
                        height: "auto",
                        maxHeight: "100%",
                        objectFit: "contain",
                        objectPosition: "bottom",
                    }}
                />
            </Box>
        </Box>
    );
}
