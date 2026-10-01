import { Box, Stack, Typography } from "@mui/material";

import RestaurantSettingsForm from "@/components/settings/RestaurantSettingsForm";
import { getUserContext } from "@/lib/auth/queries";
import { getRestaurantSettings } from "@/lib/restaurant/queries";

export default async function SettingsPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const restaurant = await getRestaurantSettings(userContext.restaurantId);

    return (
        <Stack
            sx={{
                gap: 3,
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: {
                            xs: 22,
                            sm: 24,
                        },
                        lineHeight: 1.4,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Cài đặt
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "#667085",
                    }}
                >
                    Quản lý thông tin nhà hàng của bạn.
                </Typography>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    border: "1px solid #eaecf0",
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                }}
            >
                <Stack
                    sx={{
                        gap: 3,
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 16,
                                lineHeight: 1.5,
                                fontWeight: 600,
                                color: "#193B56",
                            }}
                        >
                            Thông tin nhà hàng
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13,
                                lineHeight: 1.5,
                                color: "#667085",
                            }}
                        >
                            Cập nhật thông tin cơ bản của nhà hàng.
                        </Typography>
                    </Box>

                    <RestaurantSettingsForm initialName={restaurant.name} />
                </Stack>
            </Box>
        </Stack>
    );
}
