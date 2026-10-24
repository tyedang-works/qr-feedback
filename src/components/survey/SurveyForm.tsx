"use client";

import {
    Box,
    Button,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";

import QRTextField from "@/components/common/input/QRTextField";
import { VIETNAM_PHONE_REGEX } from "@/constants/validation.constants";
import { FEEDBACK_ISSUES } from "@/lib/feedback/constants";
import { animatedAvatarRingSx } from "@/styles/avatar.styles";
import { formErrorSx } from "@/styles/form.styles";

import Logo from "../common/Logo";
import FeedbackSuccess from "./FeedbackSuccess";

type SurveyFormProps = {
    tableToken: string;
    restaurantName: string;
    restaurantLogoUrl: string | null;
};

type SurveyFormValues = {
    selectedOptions: string[];
    feedback: string;
    phone: string;
};

type FeedbackApiResponse = {
    message?: string;
};

const initialValues: SurveyFormValues = {
    selectedOptions: [],
    feedback: "",
    phone: "",
};

const validationSchema = Yup.object({
    selectedOptions: Yup.array().of(Yup.string().required()).defined(),

    feedback: Yup.string()
        .max(1000, "Nội dung không được vượt quá 1000 ký tự.")
        .test(
            "issue-or-feedback-required",
            "Vui lòng chọn ít nhất một vấn đề hoặc chia sẻ thêm phản hồi.",
            function (value) {
                const selectedOptions = (this.parent.selectedOptions ??
                    []) as string[];

                return selectedOptions.length > 0 || Boolean(value?.trim());
            },
        ),

    phone: Yup.string()
        .required("Vui lòng nhập số điện thoại.")
        .test("valid-vietnam-phone", "Số điện thoại không hợp lệ.", (value) => {
            const normalizedPhone = value?.replace(/\s/g, "") ?? "";

            return (
                normalizedPhone.length > 0 &&
                VIETNAM_PHONE_REGEX.test(normalizedPhone)
            );
        }),
});

const lightSurveyTokens = {
    "--color-input-background": "#FFFFFF",
    "--color-surface": "#FFFFFF",
    "--color-surface-hover": "#F8FAFC",
    "--color-surface-active": "#F1F5F9",
    "--color-text-primary": "#172033",
    "--color-text-secondary": "#64748B",
    "--color-text-muted": "#94A3B8",
    "--color-border": "#E2E8F0",
    "--color-input-border": "#CBD5E1",
    "--color-input-border-hover": "#94A3B8",
    "--color-input-focus": "#315A78",
    "--color-button-primary-bg": "#193B56",
} as const;

const sectionTitleSx = {
    color: "#111827",
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.3,
};

const sectionDescriptionSx = {
    color: "#111827",
    fontSize: 13,
    lineHeight: 1.5,
    mb: 0.5,
    mt: 0.5,
};

const checkboxItemSx = (checked: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    width: "100%",
    minHeight: 48,
    px: 1.5,
    py: 1,
    border: "1px solid",
    borderColor: checked ? "#8BAAC1" : "#E0E6ED",
    borderRadius: 2,
    bgcolor: checked ? "#F0F6FA" : "#FFFFFF",
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transition: "background-color 180ms ease, border-color 180ms ease",
    "&:hover": {
        bgcolor: checked ? "#F0F6FA" : "#F8FAFC",
    },
    "&:active": {
        bgcolor: checked ? "#E8F1F7" : "#F1F5F9",
    },
});

const checkboxInputSx = (checked: boolean) => ({
    appearance: "none",
    WebkitAppearance: "none",
    display: "grid",
    placeContent: "center",
    flexShrink: 0,
    width: 20,
    height: 20,
    m: 0,
    border: "1.5px solid",
    borderColor: checked ? "#111827" : "#B8C4D0",
    borderRadius: "6px",
    bgcolor: checked ? "#111827" : "#FFFFFF",
    cursor: "pointer",
    transition: "background-color 160ms ease, border-color 160ms ease",
    "&::before": {
        content: '""',
        width: 9,
        height: 5,
        borderLeft: "2px solid #FFFFFF",
        borderBottom: "2px solid #FFFFFF",
        transform: "rotate(-45deg) scale(0)",
        transformOrigin: "center",
        transition: "transform 120ms ease",
    },
    "&:checked::before": {
        transform: "rotate(-45deg) scale(1)",
    },
});

export default function SurveyForm({
    tableToken,
    restaurantName,
    restaurantLogoUrl,
}: SurveyFormProps) {
    return (
        <Formik<SurveyFormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (
                values,
                { setSubmitting, setStatus }: FormikHelpers<SurveyFormValues>,
            ) => {
                setStatus(undefined);

                try {
                    const response = await fetch("/api/feedback", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            tableToken,
                            selectedOptions: values.selectedOptions,
                            feedback: values.feedback.trim(),
                            phone: values.phone.replace(/\s/g, ""),
                        }),
                    });

                    const data = (await response.json()) as FeedbackApiResponse;

                    if (!response.ok) {
                        setStatus(data.message || "Không thể gửi phản hồi.");
                        return;
                    }

                    setStatus({ success: true });
                } catch (error) {
                    console.error("Failed to submit feedback:", error);
                    setStatus(
                        "Không thể kết nối đến hệ thống. Vui lòng thử lại.",
                    );
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({
                values,
                errors,
                touched,
                status,
                handleChange,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
            }) => {
                if (
                    typeof status === "object" &&
                    status !== null &&
                    "success" in status &&
                    status.success
                ) {
                    return (
                        <FeedbackSuccess
                            restaurantName={restaurantName}
                            restaurantLogoUrl={restaurantLogoUrl}
                        />
                    );
                }

                const submitError = typeof status === "string" ? status : "";
                const hasSelection = values.selectedOptions.length > 0;
                const issueOrFeedbackError =
                    touched.feedback && errors.feedback && !hasSelection;

                return (
                    <Box
                        sx={{
                            ...lightSurveyTokens,
                            minHeight: "100vh",
                            bgcolor: "#F4F7FA",
                            color: "#172033",
                            px: { xs: 1.5, sm: 2.5 },
                            py: { xs: 2, sm: 4, md: 5 },
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            justifyContent: "center",
                        }}
                    >
                        <Container
                            maxWidth="sm"
                            sx={{
                                p: "0 !important",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Paper
                                component={Form}
                                noValidate
                                elevation={0}
                                sx={{
                                    width: "100%",
                                    maxWidth: 500,
                                    overflow: "hidden",
                                    bgcolor: "#FFFFFF",
                                    color: "#172033",
                                    border: "1px solid #E5EAF0",
                                    borderRadius: { xs: 3, sm: 4 },
                                    boxShadow:
                                        "0 16px 48px rgba(15, 23, 42, 0.07)",
                                }}
                            >
                                {/* header */}
                                <Box
                                    sx={{
                                        px: { xs: 2.5, sm: 4 },
                                        pt: { xs: 3, sm: 4 },
                                        pb: 2.5,
                                        textAlign: "center",
                                        borderBottom: "1px solid #EEF2F6",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            ...animatedAvatarRingSx,
                                            width: 86,
                                            height: 86,
                                            mx: "auto",
                                            mb: 1.5,
                                            display: "grid",
                                            placeItems: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {restaurantLogoUrl ? (
                                            <Box
                                                component="img"
                                                src={restaurantLogoUrl}
                                                alt={`Logo ${restaurantName}`}
                                                sx={{
                                                    width: 78,
                                                    height: 78,
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                    bgcolor: "#FFFFFF",
                                                    position: "relative",
                                                }}
                                            />
                                        ) : (
                                            <Logo />
                                        )}
                                    </Box>

                                    <Typography
                                        sx={{
                                            color: "#172033",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            lineHeight: 1.45,
                                            mb: 0.5,
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {restaurantName || "Nhà hàng"}
                                    </Typography>

                                    <Typography
                                        component="h1"
                                        sx={{
                                            color: "#172033",
                                            fontSize: { xs: 22, sm: 24 },
                                            fontWeight: 800,
                                            letterSpacing: "-0.025em",
                                            lineHeight: 1.3,
                                            mt: 1,
                                        }}
                                    >
                                        Phản hồi của bạn
                                    </Typography>

                                    <Typography
                                        sx={{
                                            maxWidth: "90%",
                                            mx: "auto",
                                            color: "#64748B",
                                            fontSize: 13,
                                            lineHeight: 1.65,
                                        }}
                                    >
                                        Chia sẻ trải nghiệm của bạn để chúng tôi
                                        phục vụ tốt hơn.
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        px: { xs: 2, sm: 3 },
                                        py: { xs: 2, sm: 3 },
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            mb: 3,
                                            position: "relative",
                                        }}
                                    >
                                        <Typography
                                            component="h2"
                                            sx={sectionTitleSx}
                                        >
                                            Bạn gặp vấn đề gì?
                                        </Typography>

                                        <Typography sx={sectionDescriptionSx}>
                                            Bạn có thể chọn nhiều vấn đề.
                                        </Typography>

                                        <Stack sx={{ gap: 1 }}>
                                            {FEEDBACK_ISSUES.map((issue) => {
                                                const checked =
                                                    values.selectedOptions.includes(
                                                        issue.option,
                                                    );

                                                return (
                                                    <Box
                                                        key={issue.option}
                                                        component="label"
                                                        sx={checkboxItemSx(
                                                            checked,
                                                        )}
                                                    >
                                                        <Box
                                                            component="input"
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => {
                                                                const nextOptions =
                                                                    checked
                                                                        ? values.selectedOptions.filter(
                                                                              (
                                                                                  option,
                                                                              ) =>
                                                                                  option !==
                                                                                  issue.option,
                                                                          )
                                                                        : [
                                                                              ...values.selectedOptions,
                                                                              issue.option,
                                                                          ];

                                                                void setFieldValue(
                                                                    "selectedOptions",
                                                                    nextOptions,
                                                                );
                                                                void setFieldTouched(
                                                                    "selectedOptions",
                                                                    true,
                                                                    false,
                                                                );
                                                            }}
                                                            aria-label={
                                                                issue.label
                                                            }
                                                            sx={checkboxInputSx(
                                                                checked,
                                                            )}
                                                        />

                                                        <Typography
                                                            sx={{
                                                                flex: 1,
                                                                color: "#253247",
                                                                fontSize: 14,
                                                                fontWeight: 500,
                                                                lineHeight: 1.5,
                                                            }}
                                                        >
                                                            {issue.label}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>

                                        {issueOrFeedbackError && (
                                            <Typography
                                                component="p"
                                                sx={formErrorSx}
                                            >
                                                {errors.feedback}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ mb: 3, mt: "36px" }}>
                                        <Typography
                                            component="h2"
                                            sx={sectionTitleSx}
                                        >
                                            Bạn có thể chia sẻ thêm
                                        </Typography>

                                        <Typography sx={sectionDescriptionSx}>
                                            Thông tin chi tiết giúp chúng tôi
                                            hiểu vấn đề rõ hơn.
                                        </Typography>

                                        <QRTextField
                                            name="feedback"
                                            multiline
                                            minRows={3}
                                            value={values.feedback}
                                            onChange={handleChange}
                                            onBlur={() =>
                                                void setFieldTouched(
                                                    "feedback",
                                                    true,
                                                )
                                            }
                                            placeholder="Ví dụ: Món ăn hôm nay chưa hợp khẩu vị..."
                                            errorMessage={
                                                touched.feedback &&
                                                errors.feedback
                                                    ? errors.feedback
                                                    : undefined
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    maxLength: 1000,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3, mt: "36px" }}>
                                        <Typography
                                            component="h2"
                                            sx={sectionTitleSx}
                                        >
                                            Số điện thoại{" "}
                                            <Box
                                                component="span"
                                                sx={{ color: "#D92D20" }}
                                            >
                                                *
                                            </Box>
                                        </Typography>

                                        <Typography sx={sectionDescriptionSx}>
                                            Để chúng tôi có thể liên hệ và hỗ
                                            trợ bạn khi cần thiết.
                                        </Typography>

                                        <QRTextField
                                            name="phone"
                                            required
                                            type="tel"
                                            autoComplete="tel"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={() =>
                                                void setFieldTouched(
                                                    "phone",
                                                    true,
                                                )
                                            }
                                            placeholder="Nhập số điện thoại"
                                            errorMessage={
                                                touched.phone && errors.phone
                                                    ? errors.phone
                                                    : undefined
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    inputMode: "tel",
                                                    maxLength: 15,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 1,
                                            mb: 3,
                                            p: 1.5,
                                            border: "1px solid #E7EDF3",
                                            borderRadius: 2,
                                            bgcolor: "#F8FAFC",
                                            mt: 3,
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            aria-hidden
                                            sx={{
                                                mt: "1px",
                                                fontSize: 14,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            🔒
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: "#64748B",
                                                fontSize: 11,
                                                lineHeight: 1.65,
                                                fontStyle: "italic",
                                            }}
                                        >
                                            Thông tin của bạn được bảo mật và
                                            chỉ được sử dụng để tiếp nhận, xử lý
                                            phản hồi và hỗ trợ chăm sóc khách
                                            hàng khi cần thiết. Chúng tôi không
                                            sử dụng số điện thoại cho mục đích
                                            quảng cáo hoặc chia sẻ cho bên thứ
                                            ba khi chưa có sự đồng ý của bạn.
                                        </Typography>
                                    </Box>

                                    {submitError && (
                                        <Box
                                            role="alert"
                                            sx={{
                                                mb: 2,
                                                px: 1.5,
                                                py: 1.25,
                                                border: "1px solid #FECACA",
                                                borderRadius: 2,
                                                bgcolor: "#FEF2F2",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "#B42318",
                                                    fontSize: 13,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {submitError}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={{
                                            minHeight: 46,
                                            borderRadius: 2,
                                            bgcolor: "#111827",
                                            color: "#FFFFFF",
                                            textTransform: "none",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            boxShadow: "none",
                                            transition:
                                                "background-color 160ms ease, transform 160ms ease",
                                            "&:hover": {
                                                bgcolor: "#212427",
                                                boxShadow: "none",
                                            },
                                            "&:active": {
                                                bgcolor: "#16344B",
                                                transform: "scale(0.995)",
                                            },
                                            "&.Mui-disabled": {
                                                bgcolor: "#8FA1B0",
                                                color: "#FFFFFF",
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
                                                        width: 16,
                                                        height: 16,
                                                        border: "2px solid rgba(255,255,255,0.45)",
                                                        borderTopColor:
                                                            "#FFFFFF",
                                                        borderRadius: "50%",
                                                        animation:
                                                            "surveySpinner 700ms linear infinite",
                                                        "@keyframes surveySpinner":
                                                            {
                                                                to: {
                                                                    transform:
                                                                        "rotate(360deg)",
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
                                </Box>
                            </Paper>
                        </Container>
                    </Box>
                );
            }}
        </Formik>
    );
}
