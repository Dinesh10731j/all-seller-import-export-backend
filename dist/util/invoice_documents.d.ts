import { InvoiceTemplateData } from "../dto/interface";
type Totals = {
    subtotal: number;
    tax: number;
    discount: number;
    shipping: number;
    chargesTotal: number;
    importerChargesTotal: number;
    exporterChargesTotal: number;
    sharedChargesTotal: number;
    total: number;
};
export declare const calculateInvoiceTotals: (invoice: InvoiceTemplateData) => Totals;
export declare const generateInvoicePdfBuffer: (invoice: InvoiceTemplateData) => Promise<Buffer>;
export declare const generateInvoiceExcelBuffer: (invoice: InvoiceTemplateData) => Promise<Buffer>;
export declare const generateInvoiceImageBuffer: (invoice: InvoiceTemplateData) => Promise<Buffer>;
export {};
//# sourceMappingURL=invoice_documents.d.ts.map