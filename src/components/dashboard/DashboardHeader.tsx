import { Avatar, Box, Stack, Typography } from "@mui/material";

type DashboardHeaderProps = {
    fullName?: string | null;
    restaurantName?: string | null;
};

export default function DashboardHeader({
    fullName,
    restaurantName,
}: DashboardHeaderProps) {
    const displayName = fullName?.trim() || "Admin";

    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: {
                            xs: 24,
                            sm: 26,
                        },
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Welcome back, {displayName}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 14,
                        color: "#667085",
                    }}
                >
                    {restaurantName || "QR Feedback"}
                </Typography>
            </Box>

            <Avatar
                sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#193B56",
                    fontSize: 15,
                    fontWeight: 700,
                }}
            >
                {displayName.charAt(0).toUpperCase()}
            </Avatar>
        </Stack>
    );
}
