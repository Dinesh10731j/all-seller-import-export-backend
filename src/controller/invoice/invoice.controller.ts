import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { HTTP_STATUS } from "../../constant/statusCode.interface";
import { Message } from "../../constant/message.interface";
import { enqueueEmail } from "../../jobs/email.job";
import { buildInvoiceEmailJob } from "../../function/email.functions";
import {
  ExportInvoiceDocumentsDTO,
  SendInvoiceEmailDTO,
} from "../../dto/invoice/invoice.dto";
import {
  generateInvoiceExcelBuffer,
  generateInvoiceImageBuffer,
  generateInvoicePdfBuffer,
} from "../../util/invoice_documents";

export class InvoiceController {
  static async emailInvoice(req: Request, res: Response) {
    const dto = plainToInstance(SendInvoiceEmailDTO, req.body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

    const job = await enqueueEmail(
      buildInvoiceEmailJob({
        to: dto.to,
        invoice: dto.invoice,
        ...(dto.subject ? { subject: dto.subject } : {}),
      })
    );

    return res.status(HTTP_STATUS.OK).json({
      message: Message.SUCCESS,
      jobId: job.id,
    });
  }

  static async exportInvoiceDocuments(req: Request, res: Response) {
    const dto = plainToInstance(ExportInvoiceDocumentsDTO, req.body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);

    const tasks = dto.formats.map(async (format) => {
      if (format === "pdf") {
        const content = await generateInvoicePdfBuffer(dto.invoice);
        return {
          format,
          filename: `invoice-${dto.invoice.invoiceNumber}.pdf`,
          contentType: "application/pdf",
          contentBase64: content.toString("base64"),
        };
      }

      if (format === "excel") {
        const content = await generateInvoiceExcelBuffer(dto.invoice);
        return {
          format,
          filename: `invoice-${dto.invoice.invoiceNumber}.xlsx`,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          contentBase64: content.toString("base64"),
        };
      }

      const content = await generateInvoiceImageBuffer(dto.invoice);
      return {
        format,
        filename: `invoice-${dto.invoice.invoiceNumber}.svg`,
        contentType: "image/svg+xml",
        contentBase64: content.toString("base64"),
      };
    });

    const files = await Promise.all(tasks);

    return res.status(HTTP_STATUS.OK).json({
      message: Message.SUCCESS,
      files,
    });
  }
}
