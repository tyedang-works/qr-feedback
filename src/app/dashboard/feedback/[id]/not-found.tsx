import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function FeedbackNotFound() {
    return (
        <Stack
            sx={{
                minHeight: "60vh",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
                color: "var(--color-text-primary)",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        mb: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-surface-hover)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    <AlertCircle size={26} strokeWidth={1.7} />
                </Box>

                <Typography
                    component="h1"
                    sx={{
                        fontSize: 22,
                        lineHeight: 1.4,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                    }}
                >
                    Feedback không tồn tại
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        maxWidth: 360,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Phản hồi này không tồn tại hoặc bạn không có quyền truy cập.
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
                            backgroundColor: "var(--color-button-primary-bg)",
                            color: "var(--color-button-primary-text)",
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor:
                                    "var(--color-button-primary-hover)",
                                boxShadow: "none",
                            },
                            "&:active": {
                                backgroundColor:
                                    "var(--color-button-primary-active)",
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
