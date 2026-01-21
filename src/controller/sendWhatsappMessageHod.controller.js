import axiosclient from "../../utils/axiosConnector.js";
import { sendPayloadForWhatsappMessage } from "../utils/whatsappMessage.utils.js";

const sendWhatsappMessageHod = async (req, res) => {
  console.log("HOD WhatsApp message sending...");
  const { employeId, tableid } = req.query;
  const { whomtoSend, employeeName, who } = req.body;
  const phoneNumber = whomtoSend;
  const templateName = "leave_request_form_backend"; // Update this if HOD has a different template
  const templateLanguage = "en_US";
  const dynamicLink = `${employeId}/${tableid}`;
  const enhancedComponents = [
    {
      type: "body",
      parameters: [
        {
          type: "text",
          text: employeeName,
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
