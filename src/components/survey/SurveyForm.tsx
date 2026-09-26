"use client";

import {
    Box,
    Button,
    Container,
    FormGroup,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import Logo from "../common/Logo";
import FeedbackSuccess from "./FeedbackSuccess";

const surveyOptions = [
    {
        id: "food_quality",
        label: "Món ăn chưa đạt yêu cầu",
    },
    {
        id: "food_presentation",
        label: "Món ăn trình bày chưa đẹp",
    },
    {
        id: "service",
        label: "Phục vụ chưa tốt",
    },
    {
        id: "space_cleanliness",
        label: "Không gian / vệ sinh chưa tốt",
    },
    {
        id: "service_time",
        label: "Thời gian phục vụ quá lâu",
    },
];

type SurveyFormProps = {
    tableToken: string;
};

export default function SurveyForm({
    tableToken,
}: SurveyFormProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState("");
    const [phone, setPhone] = useState("");

    const [errors, setErrors] = useState({
        feedback: "",
        phone: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleToggleOption = (id: string) => {
        setSelectedOptions((current) => {
            const next = current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id];

            if (next.length > 0 && errors.feedback) {
                setErrors((currentErrors) => ({
                    ...currentErrors,
                    feedback: "",
                }));
            }

            return next;
        });
    };

    const validate = () => {
        const nextErrors = {
            feedback: "",
            phone: "",
        };

        const hasIssue =
            selectedOptions.length > 0 || feedback.trim().length > 0;

        if (!hasIssue) {
            nextErrors.feedback =
                "Vui lòng chọn ít nhất một vấn đề hoặc chia sẻ thêm phản hồi.";
        }

        const normalizedPhone = phone.replace(/\s/g, "");

        if (!normalizedPhone) {
            nextErrors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!/^(0|\+84)\d{9,10}$/.test(normalizedPhone)) {
            nextErrors.phone = "Số điện thoại không hợp lệ.";
        }

        setErrors(nextErrors);

        return !nextErrors.feedback && !nextErrors.phone;
    };

    const handleSubmit = async () => {
        const isValid = validate();

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            setSubmitError("");

            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tableToken,
                    selectedOptions,
                    feedback: feedback.trim(),
                    phone: phone.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setSubmitError(
                    data.message || "Không thể gửi phản hồi.",
                );
                return;
            }

            setIsSuccess(true);
        } catch (error) {
            console.error(
                "Failed to submit feedback:",
                error,
            );

            setSubmitError(
                "Không thể kết nối đến hệ thống. Vui lòng thử lại.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return <FeedbackSuccess />;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f7f8fa",
                py: {
                    xs: 2,
                    sm: 4,
                },
                px: {
                    xs: 1.5,
                    sm: 2,
                },
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Paper
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 520,
                        borderRadius: {
                            xs: 3,
                            sm: 4,
                        },
                        p: {
                            xs: 2.5,
                            sm: 4,
                        },
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {/* Logo */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <Logo />
                    </Box>

                    {/* Header */}
                    <Box
                        sx={{
                            textAlign: "center",
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1.5,
                            }}
                        >
                            Phản hồi của bạn
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.7,
                            }}
                        >
                            Hãy chia sẻ trải nghiệm của bạn để chúng tôi có thể phục vụ bạn
                            tốt hơn.
                        </Typography>
                    </Box>

                    {/* Issues */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                mb: 0.75,
                            }}
                        >
                            Bạn gặp vấn đề gì?
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: 13,
                                mb: 2,
                            }}
                        >
                            Bạn có thể chọn nhiều vấn đề.
                        </Typography>

                        <FormGroup
                            sx={{
                                gap: 1.25,
                            }}
                        >
                            {surveyOptions.map((option) => {
                                const checked = selectedOptions.includes(option.id);

                                return (
                                    <Box
                                        key={option.id}
                                        component="label"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                            minHeight: 44,
                                            px: 1,
                                            border: "1px solid",
                                            borderColor: checked ? "primary.main" : "divider",
                                            borderRadius: 2.5,
                                            backgroundColor: checked
                                                ? "action.selected"
                                                : "background.paper",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            WebkitTapHighlightColor: "transparent",
                                            transition:
                                                "border-color 0.15s ease, background-color 0.15s ease",

                                            "&:active": {
                                                backgroundColor: "action.hover",
                                            },
                                        }}
                                    >
                                        <Box
                                            component="input"
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleToggleOption(option.id)}
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                flexShrink: 0,
                                                m: 0,
                                                mr: 1.25,
                                                cursor: "pointer",
                                                accentColor: "primary.main",
                                            }}
                                        />

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: checked ? 600 : 400,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {option.label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </FormGroup>

                        {errors.feedback && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                    display: "block",
                                    mt: 1,
                                    fontSize: 12,
                                }}
                            >
                                {errors.feedback}
                            </Typography>
                        )}
                    </Box>

                    {/* Additional feedback */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                mb: 0.5,
                            }}
                        >
                            Bạn có thể chia sẻ thêm
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: 13,
                                mb: 1.5,
                            }}
                        >
                            Thông tin chi tiết sẽ giúp chúng tôi hiểu vấn đề rõ hơn.
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            value={feedback}
                            onChange={(event) => {
                                setFeedback(event.target.value);

                                if (errors.feedback) {
                                    setErrors((current) => ({
                                        ...current,
                                        feedback: "",
                                    }));
                                }
                            }}
                            placeholder="Ví dụ: Món hôm nay hơi mặn và phần trang trí chưa đẹp..."
                            error={Boolean(errors.feedback)}
                            helperText={`${feedback.length}/1000`}
                            sx={{
                                "& .MuiInputBase-root": {
                                    borderRadius: 2,
                                    padding: 0,
                                },

                                "& .MuiInputBase-input": {
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                    padding: "8px 10px",
                                },

                                "& .MuiFormHelperText-root": {
                                    fontSize: 11,
                                    marginLeft: 0,
                                    marginTop: 0.5,
                                },
                            }}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 1000,
                                },
                            }}
                        />
                    </Box>

                    {/* Phone */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                mb: 0.5,
                            }}
                        >
                            Số điện thoại{" "}
                            <Box
                                component="span"
                                sx={{
                                    color: "error.main",
                                }}
                            >
                                *
                            </Box>
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: 13,
                                mb: 1.25,
                            }}
                        >
                            Để chúng tôi có thể liên hệ và hỗ trợ bạn khi cần thiết.
                        </Typography>

                        <TextField
                            fullWidth
                            required
                            value={phone}
                            onChange={(event) => {
                                setPhone(event.target.value);

                                if (errors.phone) {
                                    setErrors((current) => ({
                                        ...current,
                                        phone: "",
                                    }));
                                }
                            }}
                            placeholder="Nhập số điện thoại"
                            type="tel"
                            autoComplete="tel"
                            size="small"
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                            sx={{
                                "& .MuiInputBase-root": {
                                    minHeight: 40,
                                    borderRadius: 2,
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: 14,
                                    padding: "8px 10px",
                                },
                                "& .MuiFormHelperText-root": {
                                    fontSize: 12,
                                    marginLeft: 0,
                                    marginTop: 0.5,
                                },
                            }}
                            slotProps={{
                                htmlInput: {
                                    inputMode: "tel",
                                    maxLength: 15,
                                },
                            }}
                        />
                    </Box>

                    {/* Privacy */}
                    <Box
                        sx={{
                            mb: 3,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "action.hover",
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                fontSize: 11,
                                lineHeight: 1.6,
                            }}
                        >
                            🔒 Thông tin của bạn được bảo mật và chỉ được sử dụng để tiếp
                            nhận, xử lý phản hồi và hỗ trợ chăm sóc khách hàng khi cần thiết.
                            Chúng tôi không sử dụng số điện thoại cho mục đích quảng cáo
                            hoặc chia sẻ cho bên thứ ba khi chưa có sự đồng ý của bạn.
                        </Typography>
                    </Box>

                    {submitError && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{
                                mb: 1.5,
                                fontSize: 12,
                                textAlign: "center",
                            }}
                        >
                            {submitError}
                        </Typography>
                    )}

                    {/* Submit */}
                    <Button
                        fullWidth
                        type="button"
                        variant="contained"
                        size="small"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        sx={{
                            minHeight: 40,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 700,
                            boxShadow: "none",
                            transition: "transform 150ms ease, box-shadow 150ms ease",
                            "&:hover": {
                                boxShadow: "none",
                                transform: "translateY(-1px)",
                            },
                            "&:active": {
                                transform: "translateY(0)",
                            },
                            "&.Mui-disabled": {
                                opacity: 0.75,
                            },
                        }}
                    >
                        {isSubmitting ? (
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        width: 15,
                                        height: 15,
                                        border: "2px solid rgba(255,255,255,0.45)",
                                        borderTopColor: "#fff",
                                        borderRadius: "50%",
                                        animation: "submitSpinner 700ms linear infinite",
                                        "@keyframes submitSpinner": {
                                            to: {
                                                transform: "rotate(360deg)",
                                            },
                                        },
                                    }}
                                />

                                <span>Đang gửi...</span>
                            </Stack>
                        ) : (
                            "Gửi phản hồi"
                        )}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}