"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const exceljs_1 = __importDefault(require("exceljs"));
const invoice_documents_1 = require("../util/invoice_documents");
const sampleInvoice = {
    invoiceNumber: "INV-TEST-001",
    issueDate: "2026-03-27",
    dueDate: "2026-04-05",
    currency: "USD",
    transportMode: "air",
    seller: {
        name: "Test Seller",
        address: "Kathmandu, NP",
    },
    buyer: {
        name: "Test Buyer",
        address: "Texas, US",
    },
    shipment: {
        origin: "Kathmandu, NP",
        destination: "Dallas, US",
        incoterm: "CIF",
        transportDocumentNumber: "AWB-1001",
    },
    items: [
        { description: "Item A", quantity: 2, unitPrice: 100, unit: "pcs" },
        { description: "Item B", quantity: 1, unitPrice: 50, unit: "pcs" },
    ],
    tax: 10,
    shipping: 15,
    discount: 5,
    charges: [
        { code: "C1", label: "Import Duty", amount: 30, payer: "importer" },
        { code: "C2", label: "Doc Fee", amount: 20, payer: "exporter" },
        { code: "C3", label: "Insurance", amount: 10, payer: "shared" },
    ],
};
const run = async () => {
    const totals = (0, invoice_documents_1.calculateInvoiceTotals)(sampleInvoice);
    strict_1.default.equal(totals.subtotal, 250);
    strict_1.default.equal(totals.tax, 10);
    strict_1.default.equal(totals.shipping, 15);
    strict_1.default.equal(totals.discount, 5);
    strict_1.default.equal(totals.chargesTotal, 60);
    strict_1.default.equal(totals.importerChargesTotal, 30);
    strict_1.default.equal(totals.exporterChargesTotal, 20);
    strict_1.default.equal(totals.sharedChargesTotal, 10);
    strict_1.default.equal(totals.total, 330);
    const pdf = await (0, invoice_documents_1.generateInvoicePdfBuffer)(sampleInvoice);
    strict_1.default.ok(pdf.length > 500);
    strict_1.default.equal(pdf.subarray(0, 4).toString("utf8"), "%PDF");
    const excel = await (0, invoice_documents_1.generateInvoiceExcelBuffer)(sampleInvoice);
    strict_1.default.ok(excel.length > 500);
    const workbook = new exceljs_1.default.Workbook();
    await workbook.xlsx.load(excel);
    const sheet = workbook.getWorksheet("Invoice");
    strict_1.default.ok(sheet);
    const values = sheet.getSheetValues().flatMap((row) => {
        if (!Array.isArray(row))
            return [];
        return row.filter((value) => value !== null && value !== undefined);
    });
    const textDump = values.map((value) => String(value)).join(" ");
    strict_1.default.match(textDump, /Charges/);
    strict_1.default.match(textDump, /Import Duty/);
    const image = await (0, invoice_documents_1.generateInvoiceImageBuffer)(sampleInvoice);
    const imageContent = image.toString("utf8");
    strict_1.default.match(imageContent, /^<svg/);
    strict_1.default.match(imageContent, /Invoice INV-TEST-001/);
    strict_1.default.match(imageContent, /Import Duty/);
    console.log("Invoice document tests passed.");
};
run().catch((error) => {
    console.error("Invoice document tests failed.", error);
    process.exit(1);
});
//# sourceMappingURL=run_invoice_tests.js.map