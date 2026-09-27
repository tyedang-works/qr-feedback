import {
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import Link from "next/link";

export default function FeedbackNotFound() {
    return (
        <Stack
            sx={{
                minHeight: "60vh",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Feedback không tồn tại
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: 14,
                        color: "#667085",
                    }}
                >
                    Phản hồi này không tồn tại hoặc bạn không có
                    quyền truy cập.
                </Typography>

                <Link
                    href="/dashboard/feedback"
                    style={{
                        display: "inline-block",
                        marginTop: 24,
                        textDecoration: "none",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            minHeight: 40,
                            px: 2.5,
                            borderRadius: 1.5,
                            backgroundColor: "#193B56",
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#193B56",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Quay lại Feedback
                    </Button>
                </Link>
            </Box>
        </Stack>
    );
}