import { InvoiceTemplateData, ResetPasswordTemplateData } from "../dto/interface";

export const renderResetPasswordEmail = (data: ResetPasswordTemplateData) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Password reset</h2>
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Click the button below to reset your password:</p>
      <p>
        <a href="${escapeAttr(data.resetLink)}" style="display:inline-block;padding:10px 14px;background:#0b5cff;color:#fff;text-decoration:none;border-radius:6px;">
          Reset password
        </a>
      </p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;
};

export const renderInvoiceEmail = (invoice: InvoiceTemplateData) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Invoice ${escapeHtml(invoice.invoiceNumber)}</h2>
      <p>Dear ${escapeHtml(invoice.buyer.name)},</p>
      <p>Please find attached your invoice in PDF, Excel, and Image format.</p>
      <p><strong>Issue date:</strong> ${escapeHtml(invoice.issueDate)}</p>
      ${invoice.dueDate ? `<p><strong>Due date:</strong> ${escapeHtml(invoice.dueDate)}</p>` : ""}
      ${invoice.notes ? `<p><strong>Notes:</strong> ${escapeHtml(invoice.notes)}</p>` : ""}
      <p>Regards,<br/>${escapeHtml(invoice.seller.name)}</p>
    </div>
  `;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttr = (value: string) => escapeHtml(value);
