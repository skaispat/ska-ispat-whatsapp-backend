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

// Template D: HR Approves → Final Message to Employee
const sendLeaveApprovedMessage = async (req, res) => {
  console.log("Sending leave approved message to employee");
  const {
    employeePhone,
    employeeName,
    leaveType,
    fromDate,
    toDate,
    totalDays,
    reason,
  } = req.body;

  const phoneNumber = employeePhone;
  const templateName = "leave_approved_final";
  const templateLanguage = "en_US";

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
  ];

  const payLoad = sendPayloadForWhatsappMessage(
    phoneNumber,
    templateName,
    templateLanguage,
    enhancedComponents,
  );

  try {
    const response = await axiosclient.post("/messages", payLoad);
    console.log("Leave approved message sent:", response.data);
    res.json(response.data);
  } catch (error) {
    console.log("WhatsApp API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
};

// Template E: HR Rejects → Final Rejection Message to Employee
const sendLeaveRejectedMessage = async (req, res) => {
  console.log("Sending leave rejected message to employee");
  const {
    employeePhone,
    employeeName,
    leaveType,
    fromDate,
    toDate,
    totalDays,
    hrRemarks,
  } = req.body;

  const phoneNumber = employeePhone;
  const templateName = "leave_rejected_final";
  const templateLanguage = "hi";

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
          text: sanitizeText(hrRemarks) || "No remarks provided",
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
    console.log("Leave rejected message sent:", response.data);
    res.json(response.data);
  } catch (error) {
    console.log("WhatsApp API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
};

export { sendLeaveApprovedMessage, sendLeaveRejectedMessage };
