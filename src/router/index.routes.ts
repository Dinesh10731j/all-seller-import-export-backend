import { Router } from "express";
import AuthRouter from "../router/authentication/authentication.router"
import InvoiceRouter from "../router/invoice/invoice.router";


const router = Router();

router.use("/auth", AuthRouter);
router.use("/invoice", InvoiceRouter);

export default router;
