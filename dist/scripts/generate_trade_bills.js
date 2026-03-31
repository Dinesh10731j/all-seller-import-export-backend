"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const invoice_documents_1 = require("../util/invoice_documents");
const nowIsoDate = new Date().toISOString().slice(0, 10);
const modeSpecificCharge = (mode) => {
    if (mode === "air") {
        return {
            code: "AIR_HANDLING",
            label: "Air Cargo Handling",
            amount: 180,
            payer: "importer",
            description: "Terminal and uplift handling for air cargo.",
        };
    }
    if (mode === "road") {
        return {
            code: "ROAD_PERMIT",
            label: "Road Permit and Toll",
            amount: 140,
            payer: "exporter",
            description: "Road permit charges and route tolls.",
        };
    }
    return {
        code: "SEA_PORT",
        label: "Port Handling and Wharfage",
        amount: 230,
        payer: "importer",
        description: "Port handling and wharf-related costs.",
    };
};
const defaultTradeCharges = (mode) => [
    {
        code: "FREIGHT",
        label: "International Freight",
        amount: 1250,
        payer: "importer",
        description: "Primary freight charge for international shipment.",
    },
    {
        code: "DOC_FEE",
        label: "Documentation Fee",
        amount: 90,
        payer: "exporter",
        description: "Invoice, packing list, and document processing.",
    },
    {
        code: "CUSTOMS_DUTY",
        label: "Customs Duty",
        amount: 420,
        payer: "importer",
        description: "Import customs duty on declared goods value.",
    },
    {
        code: "VAT_GST",
        label: "VAT/GST",
        amount: 260,
        payer: "importer",
        description: "Destination-country tax on imports.",
    },
    {
        code: "INSURANCE",
        label: "Cargo Insurance",
        amount: 95,
        payer: "shared",
        description: "Shipment risk coverage split by parties.",
    },
    {
        code: "FUEL_SURCHARGE",
        label: "Fuel Surcharge",
        amount: 110,
        payer: "shared",
        description: "Fuel volatility surcharge from carrier.",
    },
    {
        code: "CLEARANCE",
        label: "Customs Clearance Service",
        amount: 170,
        payer: "importer",
        description: "Brokerage and border clearance operations.",
    },
    {
        code: "WAREHOUSING",
        label: "Warehousing",
        amount: 80,
        payer: "importer",
        description: "Temporary bonded storage charges.",
    },
    {
        code: "INSPECTION",
        label: "Inspection and Compliance",
        amount: 75,
        payer: "exporter",
        description: "Pre-shipment inspection and regulatory checks.",
    },
    modeSpecificCharge(mode),
];
const modeBill = (mode) => ({
    invoiceNumber: `BILL-${mode.toUpperCase()}-${Date.now()}`,
    issueDate: nowIsoDate,
    dueDate: nowIsoDate,
    currency: "USD",
    transportMode: mode,
    seller: {
        name: "All Seller Import Export Pvt. Ltd.",
        address: "Kathmandu, Nepal",
        email: "ops@allseller.com",
        phone: "+977-1-5550000",
        taxId: "SELLER-TAX-001",
    },
    buyer: {
        name: "Global Trade Buyer Inc.",
        address: "New Jersey, USA",
        email: "ap@globaltradebuyer.com",
        phone: "+1-555-110-2200",
        taxId: "BUYER-TAX-778",
    },
    shipment: {
        origin: "Kathmandu, NP",
        destination: "Newark, US",
        incoterm: "CIF",
        transportDocumentNumber: `TD-${mode.toUpperCase()}-${Math.floor(Math.random() * 100000)}`,
        referenceNumber: `REF-${mode.toUpperCase()}-${Math.floor(Math.random() * 100000)}`,
    },
    items: [
        {
            description: "Consumer Electronics",
            hsCode: "8517",
            quantity: 120,
            unitPrice: 45,
            unit: "pcs",
        },
        {
            description: "Industrial Spare Parts",
            hsCode: "8483",
            quantity: 60,
            unitPrice: 80,
            unit: "pcs",
        },
    ],
    tax: 210,
    shipping: 150,
    discount: 50,
    charges: defaultTradeCharges(mode),
    notes: "This bill includes importer and exporter imposed charges for commercial trade settlement.",
});
const writeBillFiles = async (outputDir, invoice) => {
    const [pdf, excel, image] = await Promise.all([
        (0, invoice_documents_1.generateInvoicePdfBuffer)(invoice),
        (0, invoice_documents_1.generateInvoiceExcelBuffer)(invoice),
        (0, invoice_documents_1.generateInvoiceImageBuffer)(invoice),
    ]);
    const transport = invoice.transportMode || "unknown";
    const fileStem = `bill-${transport}-${invoice.invoiceNumber}`;
    await Promise.all([
        fs_1.promises.writeFile(path_1.default.join(outputDir, `${fileStem}.pdf`), pdf),
        fs_1.promises.writeFile(path_1.default.join(outputDir, `${fileStem}.xlsx`), excel),
        fs_1.promises.writeFile(path_1.default.join(outputDir, `${fileStem}.svg`), image),
    ]);
};
const parseOutputDir = () => {
    const flag = process.argv.find((arg) => arg.startsWith("--out="));
    if (!flag) {
        return path_1.default.resolve(process.cwd(), "exports", "bills", `run-${Date.now()}`);
    }
    return path_1.default.resolve(process.cwd(), flag.replace("--out=", "").trim());
};
const run = async () => {
    const outputDir = parseOutputDir();
    await fs_1.promises.mkdir(outputDir, { recursive: true });
    const modes = ["air", "road", "sea"];
    for (const mode of modes) {
        const invoice = modeBill(mode);
        await writeBillFiles(outputDir, invoice);
    }
    console.log(`Generated 3 bills (air, road, sea) in: ${outputDir}`);
    console.log("Each bill has PDF, Excel, and SVG image export.");
};
run().catch((error) => {
    console.error("Failed to generate trade bills.", error);
    process.exit(1);
});
//# sourceMappingURL=generate_trade_bills.js.map