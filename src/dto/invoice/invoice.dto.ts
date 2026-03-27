import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class PartyInfoDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  taxId?: string;
}

export class InvoiceLineItemDTO {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  hsCode?: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class InvoiceChargeDTO {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsIn(["importer", "exporter", "shared"])
  payer!: "importer" | "exporter" | "shared";

  @IsString()
  @IsOptional()
  description?: string;
}

export class ShipmentDetailsDTO {
  @IsString()
  @IsNotEmpty()
  origin!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsString()
  @IsOptional()
  incoterm?: string;

  @IsString()
  @IsOptional()
  transportDocumentNumber?: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;
}

export class InvoiceDTO {
  @IsString()
  @IsNotEmpty()
  invoiceNumber!: string;

  @IsString()
  @IsNotEmpty()
  issueDate!: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ValidateNested()
  @Type(() => PartyInfoDTO)
  seller!: PartyInfoDTO;

  @ValidateNested()
  @Type(() => PartyInfoDTO)
  buyer!: PartyInfoDTO;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineItemDTO)
  items!: InvoiceLineItemDTO[];

  @IsIn(["air", "road", "sea"])
  @IsOptional()
  transportMode?: "air" | "road" | "sea";

  @ValidateNested()
  @Type(() => ShipmentDetailsDTO)
  @IsOptional()
  shipment?: ShipmentDetailsDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceChargeDTO)
  @IsOptional()
  charges?: InvoiceChargeDTO[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  shipping?: number;

  @IsNumber()
  @IsOptional()
  total?: number;
}

export class SendInvoiceEmailDTO {
  @IsEmail()
  to!: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @ValidateNested()
  @Type(() => InvoiceDTO)
  invoice!: InvoiceDTO;
}

export class ExportInvoiceDocumentsDTO {
  @ValidateNested()
  @Type(() => InvoiceDTO)
  invoice!: InvoiceDTO;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(["pdf", "excel", "image"], { each: true })
  formats!: Array<"pdf" | "excel" | "image">;
}
