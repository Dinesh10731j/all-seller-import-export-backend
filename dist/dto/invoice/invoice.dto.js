"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportInvoiceDocumentsDTO = exports.SendInvoiceEmailDTO = exports.InvoiceDTO = exports.ShipmentDetailsDTO = exports.InvoiceChargeDTO = exports.InvoiceLineItemDTO = exports.PartyInfoDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PartyInfoDTO {
}
exports.PartyInfoDTO = PartyInfoDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PartyInfoDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PartyInfoDTO.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PartyInfoDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PartyInfoDTO.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PartyInfoDTO.prototype, "taxId", void 0);
class InvoiceLineItemDTO {
}
exports.InvoiceLineItemDTO = InvoiceLineItemDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceLineItemDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceLineItemDTO.prototype, "hsCode", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineItemDTO.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineItemDTO.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceLineItemDTO.prototype, "unit", void 0);
class InvoiceChargeDTO {
}
exports.InvoiceChargeDTO = InvoiceChargeDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceChargeDTO.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceChargeDTO.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceChargeDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["importer", "exporter", "shared"]),
    __metadata("design:type", String)
], InvoiceChargeDTO.prototype, "payer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceChargeDTO.prototype, "description", void 0);
class ShipmentDetailsDTO {
}
exports.ShipmentDetailsDTO = ShipmentDetailsDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShipmentDetailsDTO.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShipmentDetailsDTO.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ShipmentDetailsDTO.prototype, "incoterm", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ShipmentDetailsDTO.prototype, "transportDocumentNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ShipmentDetailsDTO.prototype, "referenceNumber", void 0);
class InvoiceDTO {
}
exports.InvoiceDTO = InvoiceDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceDTO.prototype, "invoiceNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceDTO.prototype, "issueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceDTO.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceDTO.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PartyInfoDTO),
    __metadata("design:type", PartyInfoDTO)
], InvoiceDTO.prototype, "seller", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PartyInfoDTO),
    __metadata("design:type", PartyInfoDTO)
], InvoiceDTO.prototype, "buyer", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceLineItemDTO),
    __metadata("design:type", Array)
], InvoiceDTO.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["air", "road", "sea"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceDTO.prototype, "transportMode", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ShipmentDetailsDTO),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ShipmentDetailsDTO)
], InvoiceDTO.prototype, "shipment", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceChargeDTO),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], InvoiceDTO.prototype, "charges", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceDTO.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InvoiceDTO.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InvoiceDTO.prototype, "tax", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InvoiceDTO.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InvoiceDTO.prototype, "shipping", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InvoiceDTO.prototype, "total", void 0);
class SendInvoiceEmailDTO {
}
exports.SendInvoiceEmailDTO = SendInvoiceEmailDTO;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendInvoiceEmailDTO.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendInvoiceEmailDTO.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => InvoiceDTO),
    __metadata("design:type", InvoiceDTO)
], SendInvoiceEmailDTO.prototype, "invoice", void 0);
class ExportInvoiceDocumentsDTO {
}
exports.ExportInvoiceDocumentsDTO = ExportInvoiceDocumentsDTO;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => InvoiceDTO),
    __metadata("design:type", InvoiceDTO)
], ExportInvoiceDocumentsDTO.prototype, "invoice", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsIn)(["pdf", "excel", "image"], { each: true }),
    __metadata("design:type", Array)
], ExportInvoiceDocumentsDTO.prototype, "formats", void 0);
//# sourceMappingURL=invoice.dto.js.map