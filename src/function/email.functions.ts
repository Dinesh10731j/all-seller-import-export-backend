import { EmailJobData, InvoiceTemplateData } from "../dto/interface";

export const buildResetPasswordEmailJob = (input: {
  to: string;
  name: string;
  resetLink: string;
}): EmailJobData => {
  return {
    to: input.to,
    subject: "Reset your password",
    templateType: "reset_password",
    templateData: {
      name: input.name,
      resetLink: input.resetLink,
    },
  };
};

export const buildInvoiceEmailJob = (input: {
  to: string;
  subject?: string;
  invoice: InvoiceTemplateData;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}): EmailJobData => {
  return {
    to: input.to,
    subject: input.subject || `Invoice ${input.invoice.invoiceNumber}`,
    templateType: "invoice",
    templateData: input.invoice,
    ...(input.cc ? { cc: input.cc } : {}),
    ...(input.bcc ? { bcc: input.bcc } : {}),
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
  };
};

