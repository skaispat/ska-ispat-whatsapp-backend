import axiosclient from "../../utils/axiosConnector.js";
import { sendPayloadForWhatsappMessage } from "../utils/whatsappMessage.utils.js";

/**
 * Send Attendance PDF via WhatsApp
 * Template: daily_attendance_attendance_to_abhi
 * Header: PDF Document
 * Body: {{1}} = Name, {{2}} = Date
 */
const sendAttendancePdfWhatsapp = async (req, res) => {
  console.log("📤 Sending Attendance PDF via WhatsApp...");

  const {
    phoneNumber, // Phone number to send to (e.g., "7898802586")
    pdfUrl, // Public URL of the PDF
    recipientName, // Name for {{1}} (e.g., "Abhishek")
    reportDate, // Date for {{2}} (e.g., "01/02/2026")
  } = req.body;

  // Validation
  if (!phoneNumber || !pdfUrl || !recipientName || !reportDate) {
    return res.status(400).json({
      error:
        "Missing required fields: phoneNumber, pdfUrl, recipientName, reportDate",
    });
  }

  const templateName = "daily_attendance_attendance_to_abhi";
  const templateLanguage = "en_US";

  // Build components for template with document header
  const components = [
    {
      type: "header",
      parameters: [
        {
          type: "document",
          document: {
            link: pdfUrl,
            filename: `Attendance_Report_${reportDate.replace(/\//g, "-")}.pdf`,
          },
        },
      ],
    },
    {
      type: "body",
      parameters: [
        {
          type: "text",
          text: recipientName, // {{1}}
        },
        {
          type: "text",
          text: reportDate, // {{2}}
        },
      ],
    },
  ];

  const payLoad = sendPayloadForWhatsappMessage(
    phoneNumber,
    templateName,
    templateLanguage,
    components,
  );

  console.log("📋 WhatsApp Payload:", JSON.stringify(payLoad, null, 2));

  try {
    const response = await axiosclient.post("/messages", payLoad);
    console.log("✅ WhatsApp message sent successfully:", response.data);
    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "❌ WhatsApp API Error:",
      error.response?.data || error.message,
    );
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

export { sendAttendancePdfWhatsapp };
