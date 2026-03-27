import { Router } from "express";
import { InvoiceController } from "../../controller/invoice/invoice.controller";
import { VerifyToken } from "../../middleware/authentication.middleware";
import { CheckRole } from "../../middleware/check-role";
import { SingleTabGuard } from "../../middleware/single_tab_guard";

const router = Router();

router.post(
  "/email",
  VerifyToken.authenticate,
  SingleTabGuard.enforce,
  CheckRole.isVerifiedUser,
  InvoiceController.emailInvoice
);

router.post(
  "/export",
  VerifyToken.authenticate,
  SingleTabGuard.enforce,
  CheckRole.isVerifiedUser,
  InvoiceController.exportInvoiceDocuments
);

export default router;
