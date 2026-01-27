import axiosclient from "../../utils/axiosConnector.js";
import { sendPayloadForWhatsappMessage } from "../utils/whatsappMessage.utils.js";

// Helper to sanitize text - removes newlines, tabs, and excessive spaces
const sanitizeText = (text) => {
  if (!text) return "N/A";
  return String(text)
    .replace(/[\r\n\t]/g, " ") // Replace newlines and tabs with space
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with single space
    .trim();
};

const sendWhatsappMessageHod = async (req, res) => {
  console.log("HOD WhatsApp message sending...");
  const { employeId, tableid } = req.query;
  const {
    whomtoSend,
    employeeName,
    empId,
    department,
    leaveType,
    fromDate,
    toDate,
    totalDays,
    reason,
  } = req.body;

  const phoneNumber = whomtoSend;
  const templateName = "hod_approve";
  const templateLanguage = "en_US";
  const dynamicLink = `${employeId}/${tableid}`;

  const enhancedComponents = [
    {
      type: "body",
      parameters: [
        {
          type: "text",
          text: sanitizeText(employeeName),
        },
        {
          type: "text",
          text: sanitizeText(department),
        },
        {
          type: "text",
          text: sanitizeText(leaveType),
        },
        {
          type: "text",
          text: sanitizeText(fromDate),
        },
        {
          type: "text",
          text: sanitizeText(toDate),
        },
        {
          type: "text",
          text: sanitizeText(totalDays),
        },
        {
          type: "text",
          text: sanitizeText(reason),
        },
      ],
    },
    {
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [
        {
          type: "text",
          text: dynamicLink, // Dynamic URL suffix for approval link
        },
      ],
    },
  ];

  const payLoad = sendPayloadForWhatsappMessage(
    phoneNumber,
    templateName,
    templateLanguage,
    enhancedComponents,
  );
  try {
    const response = await axiosclient.post("/messages", payLoad);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log("WhatsApp API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
};

export { sendWhatsappMessageHod };
