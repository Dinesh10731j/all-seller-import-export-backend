import test from "node:test";
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

test("calculateInvoiceTotals includes importer/exporter/shared charges", () => {
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
});

test("generateInvoicePdfBuffer returns valid PDF bytes", async () => {
  const buffer = await generateInvoicePdfBuffer(sampleInvoice);

  assert.ok(buffer.length > 500);
  assert.equal(buffer.subarray(0, 4).toString("utf8"), "%PDF");
});

test("generateInvoiceExcelBuffer returns workbook containing charge rows", async () => {
  const buffer = await generateInvoiceExcelBuffer(sampleInvoice);
  assert.ok(buffer.length > 500);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);
  const sheet = workbook.getWorksheet("Invoice");
  assert.ok(sheet);

  const values = sheet!.getSheetValues().flatMap((row) => {
    if (!Array.isArray(row)) return [] as unknown[];
    return row.filter((value) => value !== null && value !== undefined);
  });

  const textDump = values.map((value) => String(value)).join(" ");
  assert.match(textDump, /Charges/);
  assert.match(textDump, /Import Duty/);
});

test("generateInvoiceImageBuffer returns SVG image bytes", async () => {
  const buffer = await generateInvoiceImageBuffer(sampleInvoice);
  const content = buffer.toString("utf8");

  assert.match(content, /^<svg/);
  assert.match(content, /Invoice INV-TEST-001/);
  assert.match(content, /Import Duty/);
});



