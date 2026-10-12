import RestaurantSettingsForm from "@/components/settings/RestaurantSettingsForm";
import { canManageSettings } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import { getRestaurantSettings } from "@/lib/restaurant/queries";
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";
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
            sx={{
                gap: { xs: 3, md: 4 },
                width: "100%",
                minWidth: 0,
            }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2.5,
                        bgcolor: "#EAF3F0",
                        color: "#237A62",
                    }}
                >
                    <FontAwesomeIcon icon={faGear} style={{ fontSize: 22 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 22, sm: 26 },
                            lineHeight: 1.35,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        Cài đặt nhà hàng
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: "#667085",
                        }}
                    >
                        Quản lý thông tin và thông tin liên hệ của nhà hàng.
                    </Typography>
                </Box>
            </Stack>

            <Box
                sx={{
                    width: "100%",
                    border: "1px solid #E4E7EC",
                    borderRadius: 3,
                    bgcolor: "#FFFFFF",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(16, 24, 40, 0.03)",
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2.5, sm: 3.5 },
                        py: { xs: 3, sm: 3.5 },
                    }}
                >
                    <RestaurantSettingsForm initialSettings={restaurant} />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        px: { xs: 2.5, sm: 3.5 },
                        py: 2,
                        borderTop: "1px solid #EAECF0",
                        bgcolor: "#FCFCFD",
                    }}
                >
                    <FontAwesomeIcon
                        icon={faBell}
                        size="sm"
                        style={{
                            color: "#98A2B3",
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />

                    <Typography
                        sx={{
                            minWidth: 0,
                            flex: 1,
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: "#667085",
                            fontStyle: "italic",
                            overflowWrap: "anywhere",
                        }}
                    >
                        Thông tin nhà hàng được sử dụng trong quá trình quản lý
                        và hỗ trợ khách hàng.
                    </Typography>
                </Box>
            </Box>
        </Stack>
    );
}
