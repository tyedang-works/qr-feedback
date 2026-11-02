import { cookies } from "next/headers";
import { Box, Typography } from "@mui/material";
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
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 4,
                textAlign: "center",
                backgroundColor: "#ffffff",
                color: "#111827",
            }}
        >
            <Typography
                sx={{
                    mb: 4,
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: "#193b56",
                }}
            >
                QR Feedback
            </Typography>

            <Typography
                component="h1"
                sx={{
                    fontSize: { xs: 64, sm: 72 },
                    lineHeight: 1,
                    fontWeight: 700,
                    color: "#111827",
                }}
            >
                404
            </Typography>

            <Typography
                component="h2"
                sx={{
                    mt: 2,
                    fontSize: { xs: 18, sm: 20 },
                    lineHeight: 1.5,
                    fontWeight: 600,
                    color: "#111827",
                }}
            >
                {t.notFoundTitle}
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    maxWidth: 380,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#6b7280",
                }}
            >
                {t.notFoundDescription}
            </Typography>
        </Box>
    );
}
