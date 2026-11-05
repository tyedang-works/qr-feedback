import { Box, Paper, Typography } from "@mui/material";
import { cookies } from "next/headers";

import LanguageToggle from "@/components/common/language/LanguageToggle";
import LanguageProvider from "@/components/common/providers/LanguageProvider";
import { translations, type Locale } from "@/i18n/translations";

export default async function QRNotFound() {
    const cookieStore = await cookies();

    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    const t = translations[locale].qrCode;

    return (
        <LanguageProvider initialLocale={locale}>
            <Box
                component="main"
                sx={{
                    position: "relative",
                    minHeight: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2.5,
                    py: 8,
                    backgroundColor: "#F4F7FA",
                    color: "#111827",
                    colorScheme: "light",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: { xs: 16, sm: 24 },
                        right: { xs: 16, sm: 28 },
                    }}
                >
                    <LanguageToggle forceLight />
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 12px 36px rgba(15, 23, 42, 0.06)",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#193B56",
                            mb: 3,
                        }}
                    >
                        QR Feedback
                    </Typography>

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: { xs: 64, sm: 72 },
                            lineHeight: 1,
                            fontWeight: 800,
                            letterSpacing: "-3px",
                            color: "#193B56",
                        }}
                    >
                        404
                    </Typography>

                    <Typography
                        component="h2"
                        sx={{
                            mt: 2.5,
                            fontSize: 19,
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        {t.notFoundTitle}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 14,
                            lineHeight: 1.7,
                            color: "#6B7280",
                        }}
                    >
                        {t.notFoundDescription}
                    </Typography>
                </Paper>
            </Box>
        </LanguageProvider>
    );
}
