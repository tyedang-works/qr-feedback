type FeedbackEmailData = {
    restaurantName: string;
    tableName: string;
    selectedOptions: string[];
    feedback: string;
    phone: string;
    createdAt: string;
};

const OPTION_LABELS: Record<string, string> = {
    food_quality: "Món ăn chưa đạt yêu cầu",
    food_presentation: "Món ăn trình bày chưa đẹp",
    service: "Phục vụ chưa tốt",
    space_cleanliness: "Không gian / vệ sinh chưa tốt",
    service_time: "Thời gian phục vụ quá lâu",
};

const ISSUE_COLORS: Record<
    string,
    { background: string; border: string; text: string }
> = {
    food_quality: { background: "#FFF4E5", border: "#F2D6B5", text: "#9A5B13" },
    food_presentation: {
        background: "#F3EEFF",
        border: "#DDD0FA",
        text: "#6941C6",
    },
    service: { background: "#EFF8FF", border: "#B2DDFF", text: "#175CD3" },
    space_cleanliness: {
        background: "#ECFDF3",
        border: "#ABEFC6",
        text: "#027A48",
    },
    service_time: { background: "#FFF1F0", border: "#FECDCA", text: "#B42318" },
};

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };
        return entities[character];
    });
}

export function createFeedbackEmailHtml({
    restaurantName,
    tableName,
    selectedOptions,
    feedback,
    phone,
    createdAt,
}: FeedbackEmailData) {
    const issueLabels = selectedOptions
        .map((option) => ({
            option,
            label: OPTION_LABELS[option] ?? option,
        }))
        .map(({ option, label }) => {
            const colors = ISSUE_COLORS[option] ?? {
                background: "#F8FAFC",
                border: "#E2E8F0",
                text: "#334155",
            };

            return `
                <span style="display:inline-block;margin:0 6px 8px 0;padding:7px 11px;background:${colors.background};color:${colors.text};border:1px solid ${colors.border};border-radius:6px;font-size:13px;line-height:1.4;">
                    ${escapeHtml(label)}
                </span>
            `;
        })
        .join("");

    const safeRestaurantName = escapeHtml(restaurantName);
    const safeTableName = escapeHtml(tableName);
    const safeCreatedAt = escapeHtml(createdAt);
    const safePhone = escapeHtml(phone);
    const safeFeedback = escapeHtml(feedback.trim()).replace(
        /\r?\n/g,
        "<br />",
    );
    const safePhoneHref = phone.replace(/[^\d+]/g, "");

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QR Feedback - Có phản hồi mới</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,Helvetica,sans-serif;color:#172033;">
    <div style="width:100%;padding:28px 16px;box-sizing:border-box;">
        <div style="max-width:680px;margin:0 auto;padding:32px;background:#ffffff;border:1px solid #e8ebef;border-radius:8px;box-sizing:border-box;">
            <div style="padding-bottom:20px;border-bottom:1px solid #e8ebef;">
                <div style="font-size:13px;line-height:1.5;font-weight:700;letter-spacing:0.2px;color:#193b56;">QR Feedback</div>
                <div style="margin-top:2px;font-size:12px;line-height:1.5;color:#64748b;">Customer Feedback System</div>
            </div>

            <div style="padding:24px 0 20px;">
                <div style="font-size:24px;line-height:1.3;font-weight:700;letter-spacing:-0.4px;color:#111827;">Có phản hồi mới</div>
                <div style="margin-top:6px;font-size:14px;line-height:1.6;color:#64748b;">Một khách hàng vừa gửi phản hồi.</div>
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:24px;">
                <tr>
                    <td width="42%" valign="top" style="padding:12px 16px 12px 0;border-top:1px solid #e8ebef;border-bottom:1px solid #e8ebef;">
                        <div style="font-size:12px;line-height:1.5;color:#64748b;margin-bottom:4px;">Nhà hàng</div>
                        <div style="font-size:14px;line-height:1.5;font-weight:600;color:#172033;">${safeRestaurantName}</div>
                    </td>
                    <td width="22%" valign="top" style="padding:12px 16px;border:1px solid #e8ebef;">
                        <div style="font-size:12px;line-height:1.5;color:#64748b;margin-bottom:4px;">Bàn</div>
                        <div style="font-size:14px;line-height:1.5;font-weight:600;color:#172033;">${safeTableName}</div>
                    </td>
                    <td width="36%" valign="top" style="padding:12px 0 12px 16px;border-top:1px solid #e8ebef;border-bottom:1px solid #e8ebef;">
                        <div style="font-size:12px;line-height:1.5;color:#64748b;margin-bottom:4px;">Thời gian</div>
                        <div style="font-size:14px;line-height:1.5;font-weight:600;color:#172033;">${safeCreatedAt}</div>
                    </td>
                </tr>
            </table>

            <div style="margin-bottom:24px;">
                <div style="margin-bottom:12px;font-size:16px;line-height:1.4;font-weight:650;color:#172033;">Vấn đề khách hàng gặp phải</div>
                <div>${issueLabels || '<span style="font-size:13px;line-height:1.5;color:#64748b;">Không có lựa chọn cụ thể.</span>'}</div>
            </div>

            <div style="margin-bottom:24px;">
                <div style="margin-bottom:10px;font-size:16px;line-height:1.4;font-weight:650;color:#172033;">Chi tiết phản hồi</div>
                <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e8ebef;border-radius:6px;font-size:14px;line-height:1.7;color:#334155;">${safeFeedback || '<span style="color:#64748b;font-style:italic;">Không có nội dung chi tiết.</span>'}</div>
            </div>

            <div style="padding-bottom:24px;">
                <div style="margin-bottom:8px;font-size:16px;line-height:1.4;font-weight:650;color:#172033;">Thông tin liên hệ</div>
                <a href="tel:${escapeHtml(safePhoneHref)}" style="font-size:15px;line-height:1.5;font-weight:600;color:#193b56;text-decoration:none;">${safePhone}</a>
                <div style="margin-top:3px;font-size:12px;line-height:1.5;color:#64748b;">Số điện thoại khách hàng</div>
            </div>

            <div style="padding-top:16px;border-top:1px solid #e8ebef;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="top">
                            <div style="font-size:12px;line-height:1.6;color:#64748b;"><strong style="color:#193b56;">QR Feedback</strong><br />Customer Feedback System</div>
                        </td>
                        <td align="right" valign="top" style="padding-left:16px;">
                            <div style="font-size:12px;line-height:1.6;color:#94a3b8;">Email được gửi tự động.<br />Vui lòng không trả lời email này.</div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
`;
}
