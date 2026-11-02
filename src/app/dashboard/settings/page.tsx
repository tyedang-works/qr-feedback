import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box, Card, Stack, Typography } from "@mui/material";
import { Bell, Settings } from "lucide-react";
import PageHeader from "@/components/common/layout/PageHeader";
import RestaurantSettingsContent from "@/components/settings/RestaurantSettingsContent";
import { translations, type Locale } from "@/i18n/translations";
import { canManageSettings } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import { getRestaurantSettings } from "@/lib/restaurant/queries";
import { cardSx } from "@/styles/card.styles";

export default async function SettingsPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    if (!canManageSettings(userContext.role)) {
        redirect("/dashboard");
    }

    const restaurant = await getRestaurantSettings(userContext.restaurantId);

    const cookieStore = await cookies();
    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    const t = translations[locale].settings;

    return (
        <Stack
            component="main"
            sx={{
                width: "100%",
                minWidth: 0,
                gap: { xs: 2.5, md: 3 },
            }}
        >
            <PageHeader title={t.title} subtitle={t.subtitle} icon={Settings} />

            <Card sx={cardSx}>
                <Box sx={{ minWidth: 0 }}>
                    <RestaurantSettingsContent initialSettings={restaurant} />
                </Box>

                <Box
                    component="aside"
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        px: { xs: 2, sm: 3 },
                        py: 1.5,
                        borderTop: "1px solid var(--color-border)",
                        bgcolor: "var(--color-surface-hover)",
                        borderRadius: "5px",
                    }}
                >
                    <Bell
                        size={17}
                        style={{
                            flexShrink: 0,
                            marginTop: 2,
                            color: "var(--color-text-secondary)",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {t.informationNote}
                    </Typography>
                </Box>
            </Card>
        </Stack>
    );
}
