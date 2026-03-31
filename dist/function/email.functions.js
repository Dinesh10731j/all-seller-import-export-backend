"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInvoiceEmailJob = exports.buildResetPasswordEmailJob = void 0;
const buildResetPasswordEmailJob = (input) => {
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
exports.buildResetPasswordEmailJob = buildResetPasswordEmailJob;
const buildInvoiceEmailJob = (input) => {
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
exports.buildInvoiceEmailJob = buildInvoiceEmailJob;
//# sourceMappingURL=email.functions.js.map