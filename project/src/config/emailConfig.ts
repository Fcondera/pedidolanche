// Configuração do EmailJS
// Para configurar:
// 1. Crie uma conta em https://www.emailjs.com/
// 2. Crie um serviço de email (Gmail, Outlook, etc.)
// 3. Crie um template de email
// 4. Substitua os valores abaixo pelas suas chaves

export const emailConfig = {
  // Sua chave pública do EmailJS (encontrada em Account -> API Keys)
  publicKey: "UICdWq8exoAjsQoQc", // Configurado!

  // ID do seu serviço de email (encontrado em Email Services)
  serviceId: "service_jq65zoo", // Configurado!

  // ID do template de email (encontrado em Email Templates)
  templateId: "template_k3cvtf9", // Configurado!
};

// NOTA: Os valores acima são apenas exemplos de demonstração
// Para funcionar corretamente, você precisa:
// 1. Criar conta no EmailJS
// 2. Configurar um serviço de email
// 3. Criar um template
// 4. Substituir pelas chaves reais

// Template sugerido para o EmailJS:
//
// Subject: {{subject}}
//
// From: {{from_name}}
// To: {{to_email}}
// Reply To: {{reply_to}}
//
// Message:
// {{{message}}}
//
// Parâmetros do template:
// - to_email: Email do destinatário
// - subject: Assunto do email
// - message: Corpo do email (HTML)
// - from_name: Nome do remetente
// - reply_to: Email de resposta
