import { Router } from "express";
import { InvoiceController } from "../../controller/invoice/invoice.controller";
import { VerifyToken } from "../../middleware/authentication.middleware";
import { CheckRole } from "../../middleware/check-role";

const router = Router();

router.post(
  "/email",
  VerifyToken.authenticate,
  CheckRole.isVerifiedUser,
  InvoiceController.emailInvoice
);

router.post(
  "/export",
  VerifyToken.authenticate,
  CheckRole.isVerifiedUser,
  InvoiceController.exportInvoiceDocuments
);

export default router;
