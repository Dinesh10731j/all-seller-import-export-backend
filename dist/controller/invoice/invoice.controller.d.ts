import { Request, Response } from "express";
export declare class InvoiceController {
    static emailInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static exportInvoiceDocuments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=invoice.controller.d.ts.map