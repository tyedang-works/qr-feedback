import { Box, Paper, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import TableQRCode from "@/components/qr/TableQRCode";
import { createAdminClient } from "@/lib/supabase/admin";

type QRPageProps = {
    params: Promise<{
        token: string;
    }>;
};

export default async function QRPage({
    params,
}: QRPageProps) {
    const { token } = await params;

    const supabase = createAdminClient();

    const { data: table, error: tableError } = await supabase
        .from("tables")
        .select("id, name, restaurant_id")
        .eq("token", token)
        .single();

    if (tableError || !table) {
        console.error("Failed to find table:", tableError);
        notFound();
    }

    const { data: restaurant, error: restaurantError } =
        await supabase
            .from("restaurants")
            .select("name")
            .eq("id", table.restaurant_id)
            .single();

    if (restaurantError) {
        console.error(
            "Failed to find restaurant:",
            restaurantError,
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 3,
                backgroundColor: "#f5f7fa",
            }}
        >
            <Paper
                className="qr-page"
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    padding: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    border: "1px solid #e5e7eb",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    QR Feedback
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        mb: 0.5,
                    }}
                >
                    {restaurant?.name ?? "Nhà hàng"}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                    }}
                >
                    {table.name}
                </Typography>

                <TableQRCode token={token} />

                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        color: "text.secondary",
                    }}
                >
                    Quét mã để gửi phản hồi
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mt: 0.5,
                        color: "text.disabled",
                    }}
                >
                    Có thể tải xuống hoặc in mã QR này để đặt trên bàn.
                </Typography>
            </Paper>
        </Box>
    );
}