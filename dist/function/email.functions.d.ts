import { EmailJobData, InvoiceTemplateData } from "../dto/interface";
export declare const buildResetPasswordEmailJob: (input: {
    to: string;
    name: string;
    resetLink: string;
}) => EmailJobData;
export declare const buildInvoiceEmailJob: (input: {
    to: string;
    subject?: string;
    invoice: InvoiceTemplateData;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
}) => EmailJobData;
//# sourceMappingURL=email.functions.d.ts.map