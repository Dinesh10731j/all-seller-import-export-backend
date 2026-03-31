import { Job, Worker } from "bullmq";
import chalk from "chalk";
import { EmailJobData, InvoiceTemplateData, ResetPasswordTemplateData } from "../src/dto/interface";
import { redisConnection } from "../src/queue/redis";
import { mailFrom, mailTransporter } from "../src/util/mailer";
import { renderInvoiceEmail, renderResetPasswordEmail } from "../src/util/email_templates";
import {
  generateInvoiceExcelBuffer,
  generateInvoiceImageBuffer,
  generateInvoicePdfBuffer,
} from "../src/util/invoice_documents";
import { envConfig } from "../src/configs/env.config";

const assertMailerConfigured = () => {
  if (!envConfig.SMTP_HOST) throw new Error("SMTP_HOST is missing");
  if (!envConfig.SMTP_PORT) throw new Error("SMTP_PORT is missing");
  if (!envConfig.SMTP_USER) throw new Error("SMTP_USER is missing");
  if (!envConfig.SMTP_PASS) throw new Error("SMTP_PASS is missing");
};

export const emailWorker = new Worker<EmailJobData>(
  "emailQueue",

  
  async (job: Job<EmailJobData>) => {
    assertMailerConfigured();

    const { to, subject, templateData, templateType, cc, bcc, replyTo } = job.data;

    let html = "";
    const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];

    if (templateType === "reset_password") {
      html = renderResetPasswordEmail(templateData as ResetPasswordTemplateData);
    } else if (templateType === "invoice") {
      const invoice = templateData as InvoiceTemplateData;
      html = renderInvoiceEmail(invoice);

      const [pdf, excel, image] = await Promise.all([
        generateInvoicePdfBuffer(invoice),
        generateInvoiceExcelBuffer(invoice),
        generateInvoiceImageBuffer(invoice),
      ]);

      attachments.push(
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
        {
          filename: `invoice-${invoice.invoiceNumber}.xlsx`,
          content: excel,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        {
          filename: `invoice-${invoice.invoiceNumber}.svg`,
          content: image,
          contentType: "image/svg+xml",
        }
      );
    } else {
      const neverType: never = templateType;
      throw new Error(`Unsupported templateType: ${String(neverType)}`);
    }

    await mailTransporter.sendMail({
      from: mailFrom,
      to,
      subject,
      html,
      ...(cc ? { cc } : {}),
      ...(bcc ? { bcc } : {}),
      ...(replyTo ? { replyTo } : {}),
      ...(attachments.length ? { attachments } : {}),
    });

    console.log(chalk.blue(`Email sent to ${to} (jobId=${job.id})`));
  },
  {
    connection: redisConnection,
  }
);

emailWorker.on("failed", (job, err) => {
  console.error(chalk.red("Email job failed"), { id: job?.id, err });
});

emailWorker.on("error", (err) => {
  console.error(chalk.red("Email worker error:"), err);
});
