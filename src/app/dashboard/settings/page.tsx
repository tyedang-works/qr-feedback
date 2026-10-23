import PageHeader from "@/components/common/layout/PageHeader";
import RestaurantSettingsContent from "@/components/settings/RestaurantSettingsContent";
import { canManageSettings } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import { getRestaurantSettings } from "@/lib/restaurant/queries";
import { cardSx } from "@/styles/card.styles";
import { Box, Card, Stack, Typography } from "@mui/material";
import { Bell, Settings } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    if (!canManageSettings(userContext.role)) {
        redirect("/dashboard");
    }

    const restaurant = await getRestaurantSettings(userContext.restaurantId);

    return (
        <Stack
            component="main"
            sx={{
                width: "100%",
                minWidth: 0,
                gap: { xs: 2.5, md: 3 },
            }}
        >
            <PageHeader
                title="Cài đặt nhà hàng"
                subtitle="Quản lý thông tin và nhận diện thương hiệu của nhà hàng."
                icon={Settings}
            />

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
                        size={15}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        color="var(--color-text-muted)"
                        style={{
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />

                    <Typography
                        sx={{
                            minWidth: 0,
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: "var(--color-text-secondary)",
                            overflowWrap: "anywhere",
                        }}
                    >
                        Thông tin nhà hàng được sử dụng để quản lý hoạt động và
                        hỗ trợ khách hàng.
                    </Typography>
                </Box>
            </Card>
        </Stack>
    );
}
