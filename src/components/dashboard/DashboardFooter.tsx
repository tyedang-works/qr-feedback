"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import { Box, Link, Stack, Typography } from "@mui/material";

type DashboardFooterProps = {
    email: string;
};

export default function DashboardFooter({ email }: DashboardFooterProps) {
    const { t } = useTranslation();

    return (
        <Box
            component="footer"
            className="dashboard-footer"
            sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid var(--color-border, #F0F1F3)",
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "center",
                        sm: "flex-start",
                    },
                    justifyContent: {
                        xs: "center",
                        sm: "space-between",
                    },
                    gap: 1.5,
                    textAlign: {
                        xs: "center",
                        sm: "left",
                    },
                }}
            >
                <Typography
                    sx={{
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "var(--color-text-muted, #9CA3AF)",
                    }}
                >
                    © {new Date().getFullYear()} QR Feedback.{" "}
                    {t("common", "allRightsReserved")}
                </Typography>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Link
                        href={`mailto:${email}?subject=${encodeURIComponent(t("common", "helpEmailSubject"))}`}
                        underline="none"
                        sx={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            fontWeight: 400,
                            color: "var(--color-text-secondary, #6B7280)",
                            transition: "color 150ms ease",
                            "&:hover": {
                                color: "var(--color-text-primary, #111827)",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                            },
                        }}
                    >
                        {t("common", "help")}
                    </Link>

                    <Link
                        href={`mailto:${email}?subject=${encodeURIComponent(t("common", "contactEmailSubject"))}`}
                        underline="none"
                        sx={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            fontWeight: 400,
                            color: "var(--color-text-secondary, #6B7280)",
                            transition: "color 150ms ease",
                            "&:hover": {
                                color: "var(--color-text-primary, #111827)",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                            },
                        }}
                    >
                        {t("common", "contact")}
                    </Link>
                </Stack>
            </Stack>
        </Box>
    );
}
