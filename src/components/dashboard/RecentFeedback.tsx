import type { RecentFeedbackItem } from "@/lib/dashboard/types";
import {
    FEEDBACK_ISSUE_LABEL_MAP,
} from "@/lib/feedback/constants";
import {
    Box,
    Card,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

type RecentFeedbackProps = {
    data: RecentFeedbackItem[];
};

function formatDateTime(dateString: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
        .format(new Date(dateString))
        .replace(",", " •");
}

function getIssueLabel(option: string) {
    return (
        FEEDBACK_ISSUE_LABEL_MAP[option] ??
        option
    );
}

function getVisibleIssues(
    selectedOptions: string[],
) {
    const visibleOptions =
        selectedOptions.slice(0, 2);

    const remainingCount =
        selectedOptions.length -
        visibleOptions.length;

    return {
        visibleOptions,
        remainingCount,
    };
}

export default function RecentFeedback({
    data,
}: RecentFeedbackProps) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                backgroundColor: "#ffffff",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#193B56",
                    }}
                >
                    Recent Feedback
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 13,
                        color: "#667085",
                    }}
                >
                    5 phản hồi mới nhất
                </Typography>
            </Box>

            {data.length === 0 ? (
                <Box
                    sx={{
                        px: 3,
                        pb: 3,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#667085",
                        }}
                    >
                        Chưa có phản hồi nào.
                    </Typography>
                </Box>
            ) : (
                <Stack>
                    {data.map((item, index) => {
                        const {
                            visibleOptions,
                            remainingCount,
                        } = getVisibleIssues(
                            item.selectedOptions,
                        );

                        return (
                            <Box key={item.id}>
                                {index > 0 && <Divider />}

                                <Box
                                    sx={{
                                        px: 3,
                                        py: 2.5,
                                    }}
                                >
                                    <Stack sx={{ gap: 2 }}>
                                        {/* Table + Time */}
                                        <Stack
                                            sx={{
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                alignItems: {
                                                    xs: "flex-start",
                                                    sm: "center",
                                                },
                                                justifyContent:
                                                    "space-between",
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: "#193B56",
                                                }}
                                            >
                                                {item.tableName}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    flexShrink: 0,
                                                    fontSize: 12,
                                                    color: "#98A2B3",
                                                }}
                                            >
                                                {formatDateTime(
                                                    item.createdAt,
                                                )}
                                            </Typography>
                                        </Stack>

                                        {/* Selected Issues */}
                                        {item.selectedOptions.length >
                                            0 && (
                                                <Stack sx={{ gap: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            color: "#667085",
                                                        }}
                                                    >
                                                        Vấn đề khách hàng chọn
                                                    </Typography>

                                                    <Stack
                                                        sx={{
                                                            flexDirection: "row",
                                                            flexWrap: "wrap",
                                                            gap: 0.75,
                                                        }}
                                                    >
                                                        {visibleOptions.map(
                                                            (option) => (
                                                                <Chip
                                                                    key={option}
                                                                    label={getIssueLabel(
                                                                        option,
                                                                    )}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 28,
                                                                        borderRadius: 1,
                                                                        backgroundColor:
                                                                            "#eef4f8",
                                                                        color: "#193B56",
                                                                        fontSize: 11,
                                                                        fontWeight: 500,
                                                                    }}
                                                                />
                                                            ),
                                                        )}

                                                        {remainingCount > 0 && (
                                                            <Chip
                                                                label={`+${remainingCount}`}
                                                                size="small"
                                                                sx={{
                                                                    height: 28,
                                                                    borderRadius: 1,
                                                                    backgroundColor:
                                                                        "#f2f4f7",
                                                                    color: "#667085",
                                                                    fontSize: 11,
                                                                    fontWeight: 600,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            )}

                                        {/* Customer Feedback */}
                                        {item.feedback && (
                                            <Stack sx={{ gap: 1 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color: "#667085",
                                                    }}
                                                >
                                                    Góp ý của khách hàng
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        px: 2,
                                                        py: 1.5,
                                                        borderRadius: 1.5,
                                                        backgroundColor: "#f8fafc",
                                                        border:
                                                            "1px solid #eef2f5",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                            color: "#344054",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {item.feedback}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Card>
    );
}