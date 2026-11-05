import { Box, Paper, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import LanguageToggle from "@/components/common/language/LanguageToggle";
import LanguageProvider from "@/components/common/providers/LanguageProvider";
import TableQRCode from "@/components/qr/TableQRCode";
import { translations, type Locale } from "@/i18n/translations";
import { createAdminClient } from "@/lib/supabase/admin";

type QRPageProps = {
    params: Promise<{
        token: string;
    }>;
};

export default async function QRPage({ params }: QRPageProps) {
    const { token } = await params;

    const cookieStore = await cookies();

    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    const t = translations[locale].qrCode;

    const supabase = createAdminClient();

    const { data: table, error: tableError } = await supabase
        .from("tables")
        .select("id, name, restaurant_id")
        .eq("token", token)
        .single();

    if (tableError || !table) {
        notFound();
    }

    const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("name")
        .eq("id", table.restaurant_id)
        .single();

    if (restaurantError) {
        console.error("Failed to find restaurant:", restaurantError);
    }

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
                    px: { xs: 2, sm: 3 },
                    py: { xs: 8, sm: 5 },
                    backgroundColor: "#F4F7FA",
                    color: "#111827",

                    "@media print": {
                        minHeight: "100vh",
                        height: "100vh",
                        padding: 0,
                        margin: 0,
                        backgroundColor: "#FFFFFF !important",
                        printColorAdjust: "exact",
                        WebkitPrintColorAdjust: "exact",
                    },
                }}
            >
                {/* language toggle */}
                <Box
                    className="qr-language-toggle"
                    sx={{
                        position: "absolute",
                        top: { xs: 16, sm: 24 },
                        right: { xs: 16, sm: 28 },
                        zIndex: 10,

                        "@media print": {
                            display: "none !important",
                        },
                    }}
                >
                    <LanguageToggle forceLight />
                </Box>

                {/* QR Card */}
                <Paper
                    className="qr-page"
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        p: { xs: 2.5, sm: 4 },
                        borderRadius: 3,
                        textAlign: "center",
                        backgroundColor: "#1F2937",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 12px 36px rgba(15, 23, 42, 0.12)",

                        "@media print": {
                            "&&": {
                                width: "420px !important",
                                maxWidth: "calc(100% - 24px) !important",
                                padding: "28px !important",
                                margin: "auto !important",
                                border: "none !important",
                                borderRadius: "12px !important",
                                backgroundColor: "#1F2937 !important",
                                color: "#FFFFFF !important",
                                boxShadow: "none !important",
                                printColorAdjust: "exact",
                                WebkitPrintColorAdjust: "exact",
                                breakInside: "avoid",
                                pageBreakInside: "avoid",
                            },
                        },
                    }}
                >
                    <Typography
                        component="h1"
                        className="qr-print-note"
                        sx={{
                            fontSize: { xs: 23, sm: 26 },
                            lineHeight: 1.3,
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                            mb: 1,
                            color: "#FFFFFF",
                        }}
                    >
                        QR Feedback
                    </Typography>

                    <Typography
                        className="qr-print-note"
                        sx={{
                            color: "#D1D5DB",
                            fontSize: 14,
                            lineHeight: 1.5,
                            "@media print": {
                                color: "#D1D5DB !important",
                                marginTop: "2px",
                            },
                        }}
                    >
                        {restaurant?.name ?? t.restaurantFallback}
                    </Typography>

                    <Typography
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            fontSize: 19,
                            lineHeight: 1.35,
                            color: "#FFFFFF",
                            "@media print": {
                                color: "#FFFFFF !important",
                                marginBottom: "2px",
                            },
                        }}
                    >
                        {table.name}
                    </Typography>

                    <Typography
                        className="qr-print-note"
                        sx={{
                            mt: 0.5,
                            color: "#D1D5DB",
                            fontSize: 13,
                            lineHeight: 1.5,
                            "@media print": {
                                color: "#D1D5DB !important",
                                marginBottom: 0,
                            },
                        }}
                    >
                        {t.scanInstruction}
                    </Typography>

                    <TableQRCode token={token} />

                    <Typography
                        className="qr-print-note"
                        sx={{
                            mt: 1.5,
                            color: "#D1D5DB",
                            fontSize: 13,
                            lineHeight: 1.6,
                            "@media print": {
                                color: "#D1D5DB !important",
                                marginTop: "12px",
                            },
                        }}
                    >
                        {t.downloadPrintDescription}
                    </Typography>
                </Paper>
            </Box>
        </LanguageProvider>
    );
}
