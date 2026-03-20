import { Router } from "express";
import { AuthController } from "../../controller/auth/auth.controller";
import { VerifyToken } from "../../middleware/authentication.middleware";
import { CheckRole } from "../../middleware/check-role";

const router = Router();

router.post("/signup", VerifyToken.authenticate, CheckRole.isAdminOrSudoAdmin, AuthController.signup);
router.post("/signin", AuthController.signin);
router.post("/forgot-password", AuthController.forgotPassword);
router.patch("/reset-password", AuthController.resetPassword);

export default router;
