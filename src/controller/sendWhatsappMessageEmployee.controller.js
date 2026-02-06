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

// List of employees for which Abhishek should also receive a notification
const ABHISHEK_NOTIFICATION_EMPLOYEES = [
  "Dinesh Yadav",
  "Pawan Tiwari",
  "Ram Kumar Sahu",
  "R.K Mahapatro",
  "Priti Sahu",
  "Dharmendar",
  "ASHISH SAHU",
  "RAGHUVENDRA PRASAD TIWARI",
  "Kartikesh Kumar Sinha",
  "Akash Agrawal",
  "Parth Sahu",
  "R.N Rawat",
  "P.C Rao",
  "Dilendra bhagat",
  "Kushal Rathod",
  "Pramod kumar sahu",
  "Sumit raj",
  "Shankar",
  "Hari om shukla",
  "Anant kumar Shukla",
  "Tekeshwar Sahu",
  "Rajeev lochn sharma",
  "Punaram Niramalkar",
  "Mahendra",
  "Akash Pandilwar",
  "Gaurav Pathak",
  "Parmeshwer",
  "Radheshyam Vishwakarma",
  "Sanjiv Rathor",
  "Abhiraj Mishra",
  "Ranjeet",
  "Kapil Dwivedi",
  "Sunil",
  "Anitosh",
  "Pawan Sahu",
  "Rohini Jaiswal",
];

// Helper to check if employee name matches any in the list (case-insensitive)
const shouldNotifyAbhishek = (employeeName) => {
  if (!employeeName) return false;
  const normalizedName = employeeName.toLowerCase().trim();
  return ABHISHEK_NOTIFICATION_EMPLOYEES.some(
    (name) =>
      normalizedName.includes(name.toLowerCase()) ||
      name.toLowerCase().includes(normalizedName),
  );
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
  const templateName = "final_approval_user_template";
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

    // Check if we should also notify Abhishek
    if (shouldNotifyAbhishek(employeeName)) {
      console.log(
        "Employee matches Abhishek notification list, sending additional message...",
      );

      const abhishekPhone = process.env.ABHISHEK_NUMBER;
      const abhishekTemplate = "final_approval_abhishek";

      const abhishekComponents = [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: sanitizeText(employeeName),
            },
            {
              type: "text",
              text: sanitizeText(fromDate),
            },
            {
              type: "text",
              text: sanitizeText(toDate),
            },
          ],
        },
      ];

      const abhishekPayload = sendPayloadForWhatsappMessage(
        abhishekPhone,
        abhishekTemplate,
        templateLanguage,
        abhishekComponents,
      );

      try {
        const abhishekResponse = await axiosclient.post(
          "/messages",
          abhishekPayload,
        );
        console.log("Abhishek notification sent:", abhishekResponse.data);
      } catch (abhishekError) {
        console.log(
          "WhatsApp API Error (Abhishek):",
          abhishekError.response?.data || abhishekError.message,
        );
        // Don't fail the main request if Abhishek notification fails
      }
    }

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

  console.log(fromDate, toDate, totalDays, hrRemarks, employeeName, leaveType);
  const phoneNumber = employeePhone;
  const templateName = "final_rejection_user_template";
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

// Template: HOD Rejects → Rejection Message to Employee from HOD
const sendLeaveHodRejectedMessage = async (req, res) => {
  console.log("Sending leave HOD rejected message to employee");
  const {
    employeePhone,
    employeeName,
    leaveType,
    fromDate,
    toDate,
  } = req.body;

  console.log(fromDate, toDate, employeeName, leaveType);
  const phoneNumber = employeePhone;
  const templateName = "hod_reject";
  const templateLanguage = "en_US";

  const enhancedComponents = [
    {
      type: "body",
      parameters: [
        {
          type: "text",
          text: sanitizeText(employeeName), // {{1}} - Employee name
        },
        {
          type: "text",
          text: "leave request", // {{2}} - "pending task" placeholder
        },
        {
          type: "text",
          text: sanitizeText(leaveType), // {{3}} - Leave type
        },
        {
          type: "text",
          text: sanitizeText(fromDate), // {{4}} - From date
        },
        {
          type: "text",
          text: sanitizeText(toDate), // {{5}} - To date
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
    console.log("Leave HOD rejected message sent:", response.data);
    res.json(response.data);
  } catch (error) {
    console.log("WhatsApp API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
};

export { sendLeaveApprovedMessage, sendLeaveRejectedMessage, sendLeaveHodRejectedMessage };
