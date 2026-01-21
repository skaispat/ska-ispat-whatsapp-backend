const axiosclient = require("../utils/axiosConnector");

const sendWhatsappMessage = async (data) => {
  try {
    const response = await axiosclient.post("/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendWhatsappMessage };
