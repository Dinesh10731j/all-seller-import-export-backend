"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_router_1 = __importDefault(require("../router/authentication/authentication.router"));
const invoice_router_1 = __importDefault(require("../router/invoice/invoice.router"));
const router = (0, express_1.Router)();
router.use("/auth", authentication_router_1.default);
router.use("/invoice", invoice_router_1.default);
exports.default = router;
//# sourceMappingURL=index.routes.js.map