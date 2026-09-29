import { Box, Paper, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import TableQRCode from "@/components/qr/TableQRCode";
import { createAdminClient } from "@/lib/supabase/admin";

type QRPageProps = {
    params: Promise<{
        token: string;
    }>;
};

export default async function QRPage({ params }: QRPageProps) {
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

    const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("name")
        .eq("id", table.restaurant_id)
        .single();

    if (restaurantError) {
        console.error("Failed to find restaurant:", restaurantError);
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
                    className="qr-print-note"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    QR Feedback
                </Typography>

                <Typography
                    variant="body2"
                    className="qr-print-note"
                    sx={{
                        color: "text.secondary",
                        fontSize: 14,
                        lineHeight: 1.4,
                    }}
                >
                    {restaurant?.name ?? "Nhà hàng"}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        lineHeight: 1.3,
                        mb: 1,
                    }}
                >
                    {table.name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mb: 0,
                        color: "text.secondary",
                        fontSize: 13,
                        lineHeight: 1.4,
                    }}
                >
                    Quét mã để gửi phản hồi
                </Typography>

                <TableQRCode token={token} />

                <Typography
                    className="qr-print-note"
                    variant="body2"
                    sx={{
                        mt: 1,
                        color: "text.secondary",
                    }}
                >
                    Có thể tải xuống hoặc in mã QR này để đặt trên bàn.
                </Typography>
            </Paper>
        </Box>
    );
}
