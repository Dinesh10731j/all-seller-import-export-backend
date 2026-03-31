export interface UserPayload {
    id: number;
    email: string;
    role: string;
    isVerified: boolean;
    name: string;
}
export type EmailTemplateType = "reset_password" | "invoice";
export interface EmailJobData {
    to: string;
    subject: string;
    templateType: EmailTemplateType;
    templateData: ResetPasswordTemplateData | InvoiceTemplateData;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
}
export interface ResetPasswordTemplateData {
    name: string;
    resetLink: string;
}
export interface PartyInfo {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    taxId?: string;
}
export interface InvoiceLineItem {
    description: string;
    hsCode?: string;
    quantity: number;
    unitPrice: number;
    unit?: string;
}
export type TransportMode = "air" | "road" | "sea";
export type ChargePayer = "importer" | "exporter" | "shared";
export interface InvoiceCharge {
    code: string;
    label: string;
    amount: number;
    payer: ChargePayer;
    description?: string;
}
export interface ShipmentDetails {
    origin: string;
    destination: string;
    incoterm?: string;
    transportDocumentNumber?: string;
    referenceNumber?: string;
}
export interface InvoiceTemplateData {
    invoiceNumber: string;
    issueDate: string;
    dueDate?: string;
    currency: string;
    seller: PartyInfo;
    buyer: PartyInfo;
    items: InvoiceLineItem[];
    notes?: string;
    subtotal?: number;
    tax?: number;
    discount?: number;
    shipping?: number;
    total?: number;
    transportMode?: TransportMode;
    shipment?: ShipmentDetails;
    charges?: InvoiceCharge[];
}
//# sourceMappingURL=interface.d.ts.map