import { Box, Typography } from "@mui/material";

export default function SurveyNotFound() {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                textAlign: "center",
                backgroundColor: "#ffffff",
                color: "#111827",
            }}
        >
            <Typography
                component="h1"
                sx={{
                    fontSize: 72,
                    lineHeight: 1,
                    fontWeight: 700,
                    color: "#111827",
                }}
            >
                404
            </Typography>

            <Typography
                sx={{
                    mt: 2,
                    fontSize: 20,
                    fontWeight: 600,
                }}
            >
                Không tìm thấy bàn
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    maxWidth: 360,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#6b7280",
                }}
            >
                Mã QR không hợp lệ hoặc đường dẫn này không còn tồn tại. Vui
                lòng quét lại mã QR của nhà hàng.
            </Typography>
        </Box>
    );
}
