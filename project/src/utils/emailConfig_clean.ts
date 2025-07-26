import emailjs from "@emailjs/browser";

const EMAIL_CONFIG = {
  serviceId: "service_jq65zoo",
  templateId: "template_k3cvtf9",
  publicKey: "UICdWq8exoAjsQoQc",
};

interface EmailParams {
  to_email: string;
  subject: string;
  sector: string;
  totalValue: string;
  orderCount: number;
  attachment?: string;
  filename?: string;
}

const MAX_ATTACHMENT_SIZE = 1024 * 1024; // 1MB limit

export const sendEmail = async (templateParams: EmailParams) => {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(templateParams.to_email)) {
      throw new Error("Email inválido");
    }

    // Verificar se o anexo é muito grande
    if (
      templateParams.attachment &&
      templateParams.attachment.length > MAX_ATTACHMENT_SIZE
    ) {
      // Enviar sem anexo
      const paramsWithoutAttachment = { ...templateParams };
      delete paramsWithoutAttachment.attachment;
      delete paramsWithoutAttachment.filename;

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        paramsWithoutAttachment,
        EMAIL_CONFIG.publicKey
      );

      return { ...response, fallback: true };
    }

    // Tentar enviar com anexo primeiro
    try {
      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams,
        EMAIL_CONFIG.publicKey
      );
      return response;
    } catch (attachmentError) {
      // Se falhar com anexo, tentar sem anexo
      const paramsWithoutAttachment = { ...templateParams };
      delete paramsWithoutAttachment.attachment;
      delete paramsWithoutAttachment.filename;

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        paramsWithoutAttachment,
        EMAIL_CONFIG.publicKey
      );

      return { ...response, fallback: true };
    }
  } catch (error) {
    throw error;
  }
};
