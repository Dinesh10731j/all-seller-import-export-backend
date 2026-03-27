import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { InvoiceTemplateData } from "../dto/interface";
import {
  calculateInvoiceTotals,
  generateInvoiceExcelBuffer,
  generateInvoiceImageBuffer,
  generateInvoicePdfBuffer,
} from "../util/invoice_documents";

const sampleInvoice: InvoiceTemplateData = {
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
  const totals = calculateInvoiceTotals(sampleInvoice);
  assert.equal(totals.subtotal, 250);
  assert.equal(totals.tax, 10);
  assert.equal(totals.shipping, 15);
  assert.equal(totals.discount, 5);
  assert.equal(totals.chargesTotal, 60);
  assert.equal(totals.importerChargesTotal, 30);
  assert.equal(totals.exporterChargesTotal, 20);
  assert.equal(totals.sharedChargesTotal, 10);
  assert.equal(totals.total, 330);

  const pdf = await generateInvoicePdfBuffer(sampleInvoice);
  assert.ok(pdf.length > 500);
  assert.equal(pdf.subarray(0, 4).toString("utf8"), "%PDF");

  const excel = await generateInvoiceExcelBuffer(sampleInvoice);
  assert.ok(excel.length > 500);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(excel as any);
  const sheet = workbook.getWorksheet("Invoice");
  assert.ok(sheet);

  const values = sheet!.getSheetValues().flatMap((row) => {
    if (!Array.isArray(row)) return [] as unknown[];
    return row.filter((value) => value !== null && value !== undefined);
  });

  const textDump = values.map((value) => String(value)).join(" ");
  assert.match(textDump, /Charges/);
  assert.match(textDump, /Import Duty/);

  const image = await generateInvoiceImageBuffer(sampleInvoice);
  const imageContent = image.toString("utf8");
  assert.match(imageContent, /^<svg/);
  assert.match(imageContent, /Invoice INV-TEST-001/);
  assert.match(imageContent, /Import Duty/);

  console.log("Invoice document tests passed.");
};

run().catch((error: unknown) => {
  console.error("Invoice document tests failed.", error);
  process.exit(1);
});



