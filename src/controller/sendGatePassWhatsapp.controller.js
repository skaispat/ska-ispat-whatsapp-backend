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

/**
 * Gate Pass HOD Notification
 * Template: gate_pass_hod_message
 * Variables:
 * {{1}} = Request type (e.g., "Gate Pass")
 * {{2}} = Employee name
 * {{3}} = Department
 * {{4}} = Leave type
 * {{5}} = From date
 * {{6}} = To date
 * {{7}} = Total days
 * {{8}} = Reason
 * {{9}} = Request type for button
 */
const sendGatePassMessageToHod = async (req, res) => {
    console.log("Gate Pass HOD WhatsApp message sending...");
    const { employeId, tableid } = req.query;
    const {
        whomtoSend,
        employeeName,
        department,
        leaveType,
        fromDate,
        toDate,
        totalDays,
        reason,
    } = req.body;

    const phoneNumber = whomtoSend;
    const templateName = "gate_pass_hod_message";
    const templateLanguage = "en_US";
    const dynamicLink = `gatepass-approve/${employeId}/${tableid}`;

    const enhancedComponents = [
        {
            type: "body",
            parameters: [
                {
                    type: "text",
                    text: sanitizeText("Gate Pass"), // {{1}} Request type
                },
                {
                    type: "text",
                    text: sanitizeText(employeeName), // {{2}} Employee name
                },
                {
                    type: "text",
                    text: sanitizeText(department), // {{3}} Department
                },
                {
                    type: "text",
                    text: sanitizeText(leaveType || "Gate Pass"), // {{4}} Leave type
                },
                {
                    type: "text",
                    text: sanitizeText(fromDate), // {{5}} From date
                },
                {
                    type: "text",
                    text: sanitizeText(toDate), // {{6}} To date
                },
                {
                    type: "text",
                    text: sanitizeText(totalDays || "N/A"), // {{7}} Total days
                },
                {
                    type: "text",
                    text: sanitizeText(reason), // {{8}} Reason
                },
                {
                    type: "text",
                    text: sanitizeText("Gate Pass"), // {{9}} Request type for button
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
        console.log("Gate Pass HOD message sent:", response.data);
        res.json(response.data);
    } catch (error) {
        console.log("WhatsApp API Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Gate Pass HR Notification
 * Template: gate_pass_hod_message (same template as HOD)
 */
const sendGatePassMessageToHr = async (req, res) => {
    console.log("Gate Pass HR WhatsApp message sending...");
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
    const templateName = "gate_pass_hod_message"; // Using same template for HR
    const templateLanguage = "en_US";
    const dynamicLink = `gatepass-approve/${employeId}/${tableid}`;

    const enhancedComponents = [
        {
            type: "body",
            parameters: [
                {
                    type: "text",
                    text: sanitizeText("Gate Pass"), // {{1}} Request type
                },
                {
                    type: "text",
                    text: sanitizeText(employeeName), // {{2}} Employee name
                },
                {
                    type: "text",
                    text: sanitizeText(department), // {{3}} Department
                },
                {
                    type: "text",
                    text: sanitizeText(leaveType || "Gate Pass"), // {{4}} Leave type
                },
                {
                    type: "text",
                    text: sanitizeText(fromDate), // {{5}} From date
                },
                {
                    type: "text",
                    text: sanitizeText(toDate), // {{6}} To date
                },
                {
                    type: "text",
                    text: sanitizeText(totalDays || "N/A"), // {{7}} Total days
                },
                {
                    type: "text",
                    text: sanitizeText(reason), // {{8}} Reason
                },
                {
                    type: "text",
                    text: sanitizeText("Gate Pass"), // {{9}} Request type for button
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
                    text: dynamicLink,
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
        console.log("Gate Pass HR message sent:", response.data);
        res.json(response.data);
    } catch (error) {
        console.log("WhatsApp API Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Gate Pass Approved Message to Employee
 * Template: final_approval_user_template (reusing existing template)
 */
const sendGatePassApprovedToEmployee = async (req, res) => {
    console.log("Sending gate pass approved message to employee");
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
                    text: sanitizeText(leaveType || "Gate Pass"),
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
                    text: sanitizeText(totalDays || "N/A"),
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
        console.log("Gate pass approved message sent:", response.data);
        res.json(response.data);
    } catch (error) {
        console.log("WhatsApp API Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Gate Pass Rejected Message to Employee
 * Template: final_rejection_user_template (reusing existing template)
 */
const sendGatePassRejectedToEmployee = async (req, res) => {
    console.log("Sending gate pass rejected message to employee");
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
                    text: sanitizeText(leaveType || "Gate Pass"),
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
        console.log("Gate pass rejected message sent:", response.data);
        res.json(response.data);
    } catch (error) {
        console.log("WhatsApp API Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message,
        });
    }
};

export {
    sendGatePassMessageToHod,
    sendGatePassMessageToHr,
    sendGatePassApprovedToEmployee,
    sendGatePassRejectedToEmployee,
};
