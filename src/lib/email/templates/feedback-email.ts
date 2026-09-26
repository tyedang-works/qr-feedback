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

export function createFeedbackEmailHtml({
    restaurantName,
    tableName,
    selectedOptions,
    feedback,
    phone,
    createdAt,
}: FeedbackEmailData) {
    const issueLabels = selectedOptions
        .map((option) => OPTION_LABELS[option] ?? option)
        .map(
            (label) => `
        <span style="
          display: inline-block;
          margin: 0 6px 8px 0;
          padding: 9px 14px;
          background: #faf7f2;
          color: #263238;
          border: 1px solid #eee7dd;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.4;
        ">
          ${label}
        </span>
      `,
        )
        .join("");

    return `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>QR Feedback - Có phản hồi mới</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background: #ffffff;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Arial,
          Helvetica,
          sans-serif;
        color: #172033;
      ">

        <div style="
          width: 100%;
          padding: 40px 20px;
          box-sizing: border-box;
        ">

          <div style="
            max-width: 680px;
            margin: 0 auto;
          ">

            <!-- Header -->
            <div style="
              padding-bottom: 28px;
              border-bottom: 1px solid #e8ebef;
            ">

              <div style="
                font-size: 15px;
                line-height: 1.4;
                color: #64748b;
                margin-bottom: 24px;
              ">
                QR Feedback
              </div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td style="
                    vertical-align: bottom;
                  ">

                    <div style="
                      font-size: 34px;
                      line-height: 1.2;
                      font-weight: 700;
                      letter-spacing: -0.8px;
                      color: #111827;
                    ">
                      Có phản hồi mới
                    </div>

                    <div style="
                      margin-top: 10px;
                      font-size: 16px;
                      line-height: 1.5;
                      color: #64748b;
                    ">
                      Một khách hàng vừa gửi phản hồi.
                    </div>

                  </td>
                </tr>
              </table>

            </div>

            <!-- Basic information -->
            <div style="
              padding: 28px 0;
              border-bottom: 1px solid #e8ebef;
            ">

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <!-- Restaurant -->
                  <td
                    width="38%"
                    valign="top"
                    style="
                      padding-right: 20px;
                      border-right: 1px solid #e8ebef;
                    "
                  >
                    <div style="
                      font-size: 13px;
                      line-height: 1.4;
                      color: #94a3b8;
                      margin-bottom: 8px;
                    ">
                      Nhà hàng
                    </div>

                    <div style="
                      font-size: 16px;
                      line-height: 1.5;
                      font-weight: 600;
                      color: #172033;
                    ">
                      ${restaurantName}
                    </div>
                  </td>

                  <!-- Table -->
                  <td
                    width="25%"
                    valign="top"
                    style="
                      padding: 0 20px;
                      border-right: 1px solid #e8ebef;
                    "
                  >
                    <div style="
                      font-size: 13px;
                      line-height: 1.4;
                      color: #94a3b8;
                      margin-bottom: 8px;
                    ">
                      Bàn
                    </div>

                    <div style="
                      font-size: 16px;
                      line-height: 1.5;
                      font-weight: 600;
                      color: #172033;
                    ">
                      ${tableName}
                    </div>
                  </td>

                  <!-- Time -->
                  <td
                    width="37%"
                    valign="top"
                    style="
                      padding-left: 20px;
                    "
                  >
                    <div style="
                      font-size: 13px;
                      line-height: 1.4;
                      color: #94a3b8;
                      margin-bottom: 8px;
                    ">
                      Thời gian
                    </div>

                    <div style="
                      font-size: 16px;
                      line-height: 1.5;
                      font-weight: 600;
                      color: #172033;
                    ">
                      ${createdAt}
                    </div>
                  </td>

                </tr>
              </table>

            </div>

            <!-- Issues -->
            <div style="
              padding: 32px 0 0;
            ">

              <div style="
                font-size: 19px;
                line-height: 1.4;
                font-weight: 650;
                color: #172033;
                margin-bottom: 16px;
              ">
                Vấn đề khách hàng gặp phải
              </div>

              <div>
                ${issueLabels ||
        `
                    <span style="
                      font-size: 14px;
                      color: #94a3b8;
                    ">
                      Không có lựa chọn cụ thể.
                    </span>
                  `
        }
              </div>

            </div>

            <!-- Feedback -->
            <div style="
              padding-top: 32px;
            ">

              <div style="
                font-size: 19px;
                line-height: 1.4;
                font-weight: 650;
                color: #172033;
                margin-bottom: 16px;
              ">
                Chi tiết phản hồi
              </div>

              <div style="
                padding: 18px 20px;
                background: #f8fafc;
                border-left: 3px solid #d9dee7;
                border-radius: 0 8px 8px 0;
                font-size: 15px;
                line-height: 1.7;
                color: #334155;
              ">
                ${feedback ||
        "Không có nội dung chi tiết."
        }
              </div>

            </div>

            <!-- Contact -->
            <div style="
              padding-top: 32px;
            ">

              <div style="
                font-size: 19px;
                line-height: 1.4;
                font-weight: 650;
                color: #172033;
                margin-bottom: 14px;
              ">
                Thông tin liên hệ
              </div>

              <a
                href="tel:${phone}"
                style="
                  font-size: 17px;
                  line-height: 1.5;
                  font-weight: 600;
                  color: #2563eb;
                  text-decoration: none;
                "
              >
                ${phone}
              </a>

              <div style="
                margin-top: 5px;
                font-size: 13px;
                line-height: 1.5;
                color: #94a3b8;
              ">
                Số điện thoại khách hàng
              </div>

            </div>

            <!-- Footer -->
            <div style="
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e8ebef;
            ">

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <td valign="top">
                    <div style="
                      font-size: 13px;
                      line-height: 1.6;
                      color: #94a3b8;
                    ">
                      QR Feedback<br />
                      Customer Feedback System
                    </div>
                  </td>

                  <td
                    align="right"
                    valign="top"
                    style="
                      padding-left: 20px;
                    "
                  >
                    <div style="
                      font-size: 12px;
                      line-height: 1.6;
                      color: #a1aab8;
                    ">
                      Email được gửi tự động.<br />
                      Vui lòng không trả lời email này.
                    </div>
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