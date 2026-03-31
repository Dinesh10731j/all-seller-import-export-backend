"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const statusCode_interface_1 = require("../../constant/statusCode.interface");
const message_interface_1 = require("../../constant/message.interface");
const email_job_1 = require("../../jobs/email.job");
const email_functions_1 = require("../../function/email.functions");
const invoice_dto_1 = require("../../dto/invoice/invoice.dto");
const invoice_documents_1 = require("../../util/invoice_documents");
class InvoiceController {
    static async emailInvoice(req, res) {
        const dto = (0, class_transformer_1.plainToInstance)(invoice_dto_1.SendInvoiceEmailDTO, req.body);
        const errors = await (0, class_validator_1.validate)(dto, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0)
            return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json(errors);
        const job = await (0, email_job_1.enqueueEmail)((0, email_functions_1.buildInvoiceEmailJob)({
            to: dto.to,
            invoice: dto.invoice,
            ...(dto.subject ? { subject: dto.subject } : {}),
        }));
        return res.status(statusCode_interface_1.HTTP_STATUS.OK).json({
            message: message_interface_1.Message.SUCCESS,
            jobId: job.id,
        });
    }
    static async exportInvoiceDocuments(req, res) {
        const dto = (0, class_transformer_1.plainToInstance)(invoice_dto_1.ExportInvoiceDocumentsDTO, req.body);
        const errors = await (0, class_validator_1.validate)(dto, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0)
            return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json(errors);
        const tasks = dto.formats.map(async (format) => {
            if (format === "pdf") {
                const content = await (0, invoice_documents_1.generateInvoicePdfBuffer)(dto.invoice);
                return {
                    format,
                    filename: `invoice-${dto.invoice.invoiceNumber}.pdf`,
                    contentType: "application/pdf",
                    contentBase64: content.toString("base64"),
                };
            }
            if (format === "excel") {
                const content = await (0, invoice_documents_1.generateInvoiceExcelBuffer)(dto.invoice);
                return {
                    format,
                    filename: `invoice-${dto.invoice.invoiceNumber}.xlsx`,
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    contentBase64: content.toString("base64"),
                };
            }
            const content = await (0, invoice_documents_1.generateInvoiceImageBuffer)(dto.invoice);
            return {
                format,
                filename: `invoice-${dto.invoice.invoiceNumber}.svg`,
                contentType: "image/svg+xml",
                contentBase64: content.toString("base64"),
            };
        });
        const files = await Promise.all(tasks);
        return res.status(statusCode_interface_1.HTTP_STATUS.OK).json({
            message: message_interface_1.Message.SUCCESS,
            files,
        });
    }
}
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=invoice.controller.js.map