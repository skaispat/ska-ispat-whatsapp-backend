const sendPayloadForWhatsappMessage = (
  phoneNumber,
  templateName,
  templateLanguage,
  components,
) => {
  return {
    messaging_product: "whatsapp",
    to: `91${phoneNumber}`,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: templateLanguage,
      },
      components: components,
    },
  };
};

export { sendPayloadForWhatsappMessage };
