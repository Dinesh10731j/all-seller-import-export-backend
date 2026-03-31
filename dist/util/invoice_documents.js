"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceImageBuffer = exports.generateInvoiceExcelBuffer = exports.generateInvoicePdfBuffer = exports.calculateInvoiceTotals = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const currencyMoney = (currency, amount) => `${currency} ${round2(amount).toFixed(2)}`;
const toSafeArray = (charges) => charges ?? [];
const sumCharges = (charges, payer) => round2(charges.filter((charge) => charge.payer === payer).reduce((sum, charge) => sum + charge.amount, 0));
const getTransportLabel = (mode) => {
    if (!mode)
        return "N/A";
    if (mode === "air")
        return "Air";
    if (mode === "road")
        return "Road";
    return "Sea";
};
const escapeXml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
const calculateInvoiceTotals = (invoice) => {
    const computedSubtotal = round2(invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
    const charges = toSafeArray(invoice.charges);
    const computedChargesTotal = round2(charges.reduce((sum, charge) => sum + charge.amount, 0));
    const subtotal = invoice.subtotal ?? computedSubtotal;
    const tax = invoice.tax ?? 0;
    const discount = invoice.discount ?? 0;
    const shipping = invoice.shipping ?? 0;
    const chargesTotal = round2(computedChargesTotal);
    const importerChargesTotal = sumCharges(charges, "importer");
    const exporterChargesTotal = sumCharges(charges, "exporter");
    const sharedChargesTotal = sumCharges(charges, "shared");
    const total = invoice.total ?? round2(subtotal + tax + shipping + chargesTotal - discount);
    return {
        subtotal,
        tax,
        discount,
        shipping,
        chargesTotal,
        importerChargesTotal,
        exporterChargesTotal,
        sharedChargesTotal,
        total,
    };
};
exports.calculateInvoiceTotals = calculateInvoiceTotals;
const generateInvoicePdfBuffer = async (invoice) => {
    const totals = (0, exports.calculateInvoiceTotals)(invoice);
    const doc = new pdfkit_1.default({ size: "A4", margin: 40 });
    const charges = toSafeArray(invoice.charges);
    const chunks = [];
    doc.on("data", (c) => {
        if (Buffer.isBuffer(c)) {
            chunks.push(c);
            return;
        }
        if (c instanceof Uint8Array) {
            chunks.push(Buffer.from(c));
            return;
        }
        if (typeof c === "string") {
            chunks.push(Buffer.from(c));
        }
    });
    doc.fontSize(18).text(invoice.seller.name, { align: "left" });
    if (invoice.seller.address)
        doc.fontSize(10).text(invoice.seller.address);
    doc.moveDown(0.5);
    doc.fontSize(16).text(`Invoice ${invoice.invoiceNumber}`, { align: "right" });
    doc.fontSize(10).text(`Issue: ${invoice.issueDate}`, { align: "right" });
    if (invoice.dueDate)
        doc.fontSize(10).text(`Due: ${invoice.dueDate}`, { align: "right" });
    doc.moveDown();
    doc.fontSize(12).text("Bill To");
    doc.fontSize(10).text(invoice.buyer.name);
    if (invoice.buyer.address)
        doc.text(invoice.buyer.address);
    if (invoice.buyer.email)
        doc.text(invoice.buyer.email);
    doc.moveDown();
    doc.fontSize(12).text("Shipment");
    doc.fontSize(10).text(`Mode: ${getTransportLabel(invoice.transportMode)}`);
    if (invoice.shipment?.origin && invoice.shipment?.destination) {
        doc.text(`Route: ${invoice.shipment.origin} -> ${invoice.shipment.destination}`);
    }
    if (invoice.shipment?.incoterm)
        doc.text(`Incoterm: ${invoice.shipment.incoterm}`);
    if (invoice.shipment?.transportDocumentNumber) {
        doc.text(`Transport Doc: ${invoice.shipment.transportDocumentNumber}`);
    }
    doc.moveDown();
    doc.fontSize(12).text("Items");
    doc.moveDown(0.3);
    const itemHeaderY = doc.y;
    const itemColX = { desc: 40, qty: 330, unit: 380, amount: 460 };
    doc.fontSize(10).text("Description", itemColX.desc, itemHeaderY);
    doc.text("Qty", itemColX.qty, itemHeaderY, { width: 40, align: "right" });
    doc.text("Unit", itemColX.unit, itemHeaderY, { width: 60, align: "right" });
    doc.text("Amount", itemColX.amount, itemHeaderY, { width: 90, align: "right" });
    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#cccccc").stroke();
    doc.strokeColor("#000000");
    doc.moveDown(0.5);
    invoice.items.forEach((item) => {
        const amount = round2(item.quantity * item.unitPrice);
        const y = doc.y;
        const desc = item.hsCode ? `${item.description} (HS: ${item.hsCode})` : item.description;
        doc.fontSize(10).text(desc, itemColX.desc, y, { width: 280 });
        doc.text(String(item.quantity), itemColX.qty, y, { width: 40, align: "right" });
        doc.text(currencyMoney(invoice.currency, item.unitPrice), itemColX.unit, y, {
            width: 60,
            align: "right",
        });
        doc.text(currencyMoney(invoice.currency, amount), itemColX.amount, y, {
            width: 90,
            align: "right",
        });
        doc.moveDown();
    });
    if (charges.length) {
        doc.moveDown(0.6);
        doc.fontSize(12).text("Importer/Exporter Charges");
        doc.moveDown(0.3);
        const chargeHeaderY = doc.y;
        const chargeColX = { code: 40, label: 110, payer: 360, amount: 445 };
        doc.fontSize(10).text("Code", chargeColX.code, chargeHeaderY);
        doc.text("Charge", chargeColX.label, chargeHeaderY, { width: 230 });
        doc.text("Payer", chargeColX.payer, chargeHeaderY, { width: 80, align: "left" });
        doc.text("Amount", chargeColX.amount, chargeHeaderY, { width: 100, align: "right" });
        doc.moveDown(0.5);
        doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#cccccc").stroke();
        doc.strokeColor("#000000");
        doc.moveDown(0.5);
        charges.forEach((charge) => {
            const y = doc.y;
            doc.fontSize(10).text(charge.code, chargeColX.code, y, { width: 60 });
            doc.text(charge.label, chargeColX.label, y, { width: 230 });
            doc.text(charge.payer, chargeColX.payer, y, { width: 80 });
            doc.text(currencyMoney(invoice.currency, charge.amount), chargeColX.amount, y, {
                width: 100,
                align: "right",
            });
            doc.moveDown();
        });
    }
    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#cccccc").stroke();
    doc.strokeColor("#000000");
    doc.moveDown(0.8);
    doc.fontSize(10).text(`Subtotal: ${currencyMoney(invoice.currency, totals.subtotal)}`, {
        align: "right",
    });
    if (totals.tax) {
        doc.text(`Tax: ${currencyMoney(invoice.currency, totals.tax)}`, { align: "right" });
    }
    if (totals.shipping) {
        doc.text(`Shipping: ${currencyMoney(invoice.currency, totals.shipping)}`, {
            align: "right",
        });
    }
    if (totals.chargesTotal) {
        doc.text(`Charges: ${currencyMoney(invoice.currency, totals.chargesTotal)}`, {
            align: "right",
        });
    }
    if (totals.discount) {
        doc.text(`Discount: -${currencyMoney(invoice.currency, totals.discount)}`, {
            align: "right",
        });
    }
    doc.fontSize(12).text(`Total: ${currencyMoney(invoice.currency, totals.total)}`, {
        align: "right",
    });
    if (charges.length) {
        doc.fontSize(10).text(`Importer charges: ${currencyMoney(invoice.currency, totals.importerChargesTotal)}`, { align: "right" });
        doc.text(`Exporter charges: ${currencyMoney(invoice.currency, totals.exporterChargesTotal)}`, { align: "right" });
        doc.text(`Shared charges: ${currencyMoney(invoice.currency, totals.sharedChargesTotal)}`, {
            align: "right",
        });
    }
    if (invoice.notes) {
        doc.moveDown();
        doc.fontSize(10).text("Notes");
        doc.fontSize(9).text(invoice.notes);
    }
    const endPromise = new Promise((resolve, reject) => {
        doc.on("end", resolve);
        doc.on("error", reject);
    });
    doc.end();
    await endPromise;
    return Buffer.concat(chunks);
};
exports.generateInvoicePdfBuffer = generateInvoicePdfBuffer;
const generateInvoiceExcelBuffer = async (invoice) => {
    const totals = (0, exports.calculateInvoiceTotals)(invoice);
    const workbook = new exceljs_1.default.Workbook();
    const charges = toSafeArray(invoice.charges);
    workbook.creator = "All Seller Import Export";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Invoice");
    sheet.columns = [
        { header: "Description", key: "description", width: 45 },
        { header: "HS Code", key: "hsCode", width: 14 },
        { header: "Qty", key: "quantity", width: 10 },
        { header: "Unit", key: "unit", width: 10 },
        { header: "Unit Price", key: "unitPrice", width: 14 },
        { header: "Amount", key: "amount", width: 14 },
    ];
    sheet.addRow(["Invoice Number", invoice.invoiceNumber]);
    sheet.addRow(["Issue Date", invoice.issueDate]);
    if (invoice.dueDate)
        sheet.addRow(["Due Date", invoice.dueDate]);
    if (invoice.transportMode)
        sheet.addRow(["Transport Mode", getTransportLabel(invoice.transportMode)]);
    if (invoice.shipment?.origin && invoice.shipment?.destination) {
        sheet.addRow(["Shipment Route", `${invoice.shipment.origin} -> ${invoice.shipment.destination}`]);
    }
    if (invoice.shipment?.incoterm)
        sheet.addRow(["Incoterm", invoice.shipment.incoterm]);
    if (invoice.shipment?.transportDocumentNumber) {
        sheet.addRow(["Transport Document", invoice.shipment.transportDocumentNumber]);
    }
    sheet.addRow([]);
    sheet.addRow(["Seller", invoice.seller.name]);
    if (invoice.seller.address)
        sheet.addRow(["Seller Address", invoice.seller.address]);
    sheet.addRow(["Buyer", invoice.buyer.name]);
    if (invoice.buyer.address)
        sheet.addRow(["Buyer Address", invoice.buyer.address]);
    if (invoice.buyer.email)
        sheet.addRow(["Buyer Email", invoice.buyer.email]);
    sheet.addRow([]);
    sheet.addRow(["Items"]);
    sheet.addRow(sheet.columns.map((col) => col.header));
    invoice.items.forEach((item) => {
        const amount = round2(item.quantity * item.unitPrice);
        sheet.addRow({
            description: item.description,
            hsCode: item.hsCode || "",
            quantity: item.quantity,
            unit: item.unit || "",
            unitPrice: item.unitPrice,
            amount,
        });
    });
    if (charges.length) {
        sheet.addRow([]);
        sheet.addRow(["Charges"]);
        sheet.addRow(["Code", "Charge", "Payer", "Amount", "Description"]);
        charges.forEach((charge) => {
            sheet.addRow([
                charge.code,
                charge.label,
                charge.payer,
                charge.amount,
                charge.description || "",
            ]);
        });
    }
    sheet.addRow([]);
    sheet.addRow(["Subtotal", totals.subtotal]);
    sheet.addRow(["Tax", totals.tax]);
    sheet.addRow(["Shipping", totals.shipping]);
    sheet.addRow(["Charges", totals.chargesTotal]);
    sheet.addRow(["Discount", totals.discount]);
    sheet.addRow(["Total", totals.total]);
    sheet.addRow(["Importer Charges Total", totals.importerChargesTotal]);
    sheet.addRow(["Exporter Charges Total", totals.exporterChargesTotal]);
    sheet.addRow(["Shared Charges Total", totals.sharedChargesTotal]);
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
};
exports.generateInvoiceExcelBuffer = generateInvoiceExcelBuffer;
const generateInvoiceImageBuffer = async (invoice) => {
    const totals = (0, exports.calculateInvoiceTotals)(invoice);
    const charges = toSafeArray(invoice.charges);
    const svgRows = [];
    let y = 60;
    const push = (text, size = 16, weight = 400) => {
        svgRows.push(`<text x="60" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="#0f172a">${escapeXml(text)}</text>`);
        y += size + 12;
    };
    push(`Invoice ${invoice.invoiceNumber}`, 30, 700);
    push(`Issue: ${invoice.issueDate}`, 16, 400);
    if (invoice.dueDate)
        push(`Due: ${invoice.dueDate}`, 16, 400);
    push(`Seller: ${invoice.seller.name}`, 16, 400);
    push(`Buyer: ${invoice.buyer.name}`, 16, 400);
    push(`Transport: ${getTransportLabel(invoice.transportMode)}`, 16, 400);
    if (invoice.shipment?.origin && invoice.shipment?.destination) {
        push(`Route: ${invoice.shipment.origin} -> ${invoice.shipment.destination}`, 16, 400);
    }
    y += 8;
    push("Items", 20, 700);
    invoice.items.forEach((item, index) => {
        const amount = round2(item.quantity * item.unitPrice);
        push(`${index + 1}. ${item.description} | qty ${item.quantity} x ${currencyMoney(invoice.currency, item.unitPrice)} = ${currencyMoney(invoice.currency, amount)}`, 14, 400);
    });
    if (charges.length) {
        y += 6;
        push("Charges", 20, 700);
        charges.forEach((charge) => {
            push(`${charge.code} ${charge.label} (${charge.payer}) ${currencyMoney(invoice.currency, charge.amount)}`, 14, 400);
        });
    }
    y += 10;
    push(`Subtotal: ${currencyMoney(invoice.currency, totals.subtotal)}`, 16, 600);
    push(`Tax: ${currencyMoney(invoice.currency, totals.tax)}`, 16, 600);
    push(`Shipping: ${currencyMoney(invoice.currency, totals.shipping)}`, 16, 600);
    push(`Charges: ${currencyMoney(invoice.currency, totals.chargesTotal)}`, 16, 600);
    push(`Discount: ${currencyMoney(invoice.currency, totals.discount)}`, 16, 600);
    push(`Total: ${currencyMoney(invoice.currency, totals.total)}`, 20, 700);
    push(`Importer/Exporter/Shared: ${currencyMoney(invoice.currency, totals.importerChargesTotal)} / ${currencyMoney(invoice.currency, totals.exporterChargesTotal)} / ${currencyMoney(invoice.currency, totals.sharedChargesTotal)}`, 14, 500);
    if (invoice.notes) {
        y += 8;
        push(`Notes: ${invoice.notes}`, 14, 400);
    }
    const height = Math.max(900, y + 40);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="${height}" viewBox="0 0 1400 ${height}">
<rect x="0" y="0" width="1400" height="${height}" fill="#ffffff" />
<rect x="30" y="30" width="1340" height="${height - 60}" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
${svgRows.join("\n")}
</svg>`;
    return Buffer.from(svg, "utf-8");
};
exports.generateInvoiceImageBuffer = generateInvoiceImageBuffer;
//# sourceMappingURL=invoice_documents.js.map