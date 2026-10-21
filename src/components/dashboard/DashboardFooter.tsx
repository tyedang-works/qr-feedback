"use client";

import { Box, Link, Stack, Typography } from "@mui/material";

type DashboardFooterProps = {
    email: string;
};

export default function DashboardFooter({ email }: DashboardFooterProps) {
    return (
        <Box
            component="footer"
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
                    © {new Date().getFullYear()} QR Feedback. All rights
                    reserved.
                </Typography>

                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Link
                        href={`mailto:${email}?subject=${encodeURIComponent("Yêu cầu hỗ trợ QR Feedback")}`}
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
                        Trợ giúp
                    </Link>

                    <Link
                        href={`mailto:${email}?subject=${encodeURIComponent("Liên hệ QR Feedback")}`}
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
                        Liên hệ
                    </Link>
                </Stack>
            </Stack>
        </Box>
    );
}
