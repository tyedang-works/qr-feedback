import { Box, Typography } from "@mui/material";

export default function FeedbackSuccess() {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 3,
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    p: {
                        xs: 3,
                        sm: 4,
                    },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    textAlign: "center",
                    animation: "successCardIn 450ms ease-out",

                    "@keyframes successCardIn": {
                        from: {
                            opacity: 0,
                            transform: "translateY(12px)",
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)",
                        },
                    },
                }}
            >
                {/* Success icon */}
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 2.5,
                        borderRadius: "50%",
                        backgroundColor: "#4caf50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation:
                            "successIconIn 500ms cubic-bezier(.2,.8,.2,1)",

                        "@keyframes successIconIn": {
                            "0%": {
                                opacity: 0,
                                transform: "scale(0.6)",
                            },
                            "70%": {
                                transform: "scale(1.08)",
                            },
                            "100%": {
                                opacity: 1,
                                transform: "scale(1)",
                            },
                        },
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            width: 24,
                            height: 13,
                            borderLeft: "3px solid #fff",
                            borderBottom: "3px solid #fff",
                            transform: "rotate(-45deg)",
                            mb: 1.5,
                            animation:
                                "checkDraw 350ms 250ms ease-out both",

                            "@keyframes checkDraw": {
                                from: {
                                    opacity: 0,
                                    clipPath: "inset(0 100% 0 0)",
                                },
                                to: {
                                    opacity: 1,
                                    clipPath: "inset(0 0 0 0)",
                                },
                            },
                        }}
                    />
                </Box>

                {/* Title */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontSize: {
                            xs: 22,
                            sm: 24,
                        },
                        lineHeight: 1.3,
                        mb: 1,
                        animation:
                            "successTextIn 400ms 150ms ease-out both",

                        "@keyframes successTextIn": {
                            from: {
                                opacity: 0,
                                transform: "translateY(6px)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >
                    Cảm ơn bạn!
                </Typography>

                {/* Description */}
                <Typography
                    variant="body1"
                    sx={{
                        color: "text.secondary",
                        fontSize: 15,
                        lineHeight: 1.7,
                        animation:
                            "successTextIn 400ms 220ms ease-out both",

                        "@keyframes successTextIn": {
                            from: {
                                opacity: 0,
                                transform: "translateY(6px)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >
                    Phản hồi của bạn đã được ghi nhận.
                    <br />
                    Chúng tôi sẽ tiếp nhận và xử lý
                    <br />
                    trong thời gian sớm nhất.
                </Typography>
            </Box>
        </Box>
    );
}