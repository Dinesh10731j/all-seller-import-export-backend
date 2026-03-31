export declare class PartyInfoDTO {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    taxId?: string;
}
export declare class InvoiceLineItemDTO {
    description: string;
    hsCode?: string;
    quantity: number;
    unitPrice: number;
    unit?: string;
}
export declare class InvoiceChargeDTO {
    code: string;
    label: string;
    amount: number;
    payer: "importer" | "exporter" | "shared";
    description?: string;
}
export declare class ShipmentDetailsDTO {
    origin: string;
    destination: string;
    incoterm?: string;
    transportDocumentNumber?: string;
    referenceNumber?: string;
}
export declare class InvoiceDTO {
    invoiceNumber: string;
    issueDate: string;
    dueDate?: string;
    currency: string;
    seller: PartyInfoDTO;
    buyer: PartyInfoDTO;
    items: InvoiceLineItemDTO[];
    transportMode?: "air" | "road" | "sea";
    shipment?: ShipmentDetailsDTO;
    charges?: InvoiceChargeDTO[];
    notes?: string;
    subtotal?: number;
    tax?: number;
    discount?: number;
    shipping?: number;
    total?: number;
}
export declare class SendInvoiceEmailDTO {
    to: string;
    subject?: string;
    invoice: InvoiceDTO;
}
export declare class ExportInvoiceDocumentsDTO {
    invoice: InvoiceDTO;
    formats: Array<"pdf" | "excel" | "image">;
}
//# sourceMappingURL=invoice.dto.d.ts.map