"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controller/auth/auth.controller");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const check_role_1 = require("../../middleware/check-role");
const router = (0, express_1.Router)();
router.post("/signup", authentication_middleware_1.VerifyToken.authenticate, check_role_1.CheckRole.isAdminOrSudoAdmin, auth_controller_1.AuthController.signup);
router.post("/signin", auth_controller_1.AuthController.signin);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.patch("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.default = router;
//# sourceMappingURL=authentication.router.js.map