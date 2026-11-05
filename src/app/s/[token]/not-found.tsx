import { cookies } from "next/headers";
import { Box, Typography } from "@mui/material";
import { AlertCircle } from "lucide-react";

import LanguageToggle from "@/components/common/language/LanguageToggle";
import { translations, type Locale } from "@/i18n/translations";

export default async function SurveyNotFound() {
    const cookieStore = await cookies();

    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    const t = translations[locale].survey;

    return (
        <Box
            component="main"
            sx={{
                position: "relative",
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 2.5,
                py: 4,
                textAlign: "center",
                backgroundColor: "#F4F7FA",
                color: "#111827",
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

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        mb: 5,
                        fontSize: 15,
                        lineHeight: 1.5,
                        fontWeight: 700,
                        letterSpacing: 0.3,
                        color: "#193B56",
                    }}
                >
                    QR Feedback
                </Typography>

                <Box
                    sx={{
                        width: 76,
                        height: 76,
                        mb: 2.5,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        backgroundColor: "#FEECEC",
                    }}
                >
                    <AlertCircle size={38} strokeWidth={1.7} color="#D92D20" />
                </Box>

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
                        fontSize: { xs: 18, sm: 20 },
                        lineHeight: 1.5,
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    {t.notFoundTitle}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        maxWidth: 360,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#64748B",
                    }}
                >
                    {t.notFoundDescription}
                </Typography>

                <Typography
                    sx={{
                        mt: 5,
                        fontSize: 11,
                        color: "#94A3B8",
                    }}
                >
                    © {new Date().getFullYear()} QR Feedback
                </Typography>
            </Box>
        </Box>
    );
}
