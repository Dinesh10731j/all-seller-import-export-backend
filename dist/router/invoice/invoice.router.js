"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("../../controller/invoice/invoice.controller");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const check_role_1 = require("../../middleware/check-role");
const single_tab_guard_1 = require("../../middleware/single_tab_guard");
const router = (0, express_1.Router)();
router.post("/email", authentication_middleware_1.VerifyToken.authenticate, single_tab_guard_1.SingleTabGuard.enforce, check_role_1.CheckRole.isVerifiedUser, invoice_controller_1.InvoiceController.emailInvoice);
router.post("/export", authentication_middleware_1.VerifyToken.authenticate, single_tab_guard_1.SingleTabGuard.enforce, check_role_1.CheckRole.isVerifiedUser, invoice_controller_1.InvoiceController.exportInvoiceDocuments);
exports.default = router;
//# sourceMappingURL=invoice.router.js.map