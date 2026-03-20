import { Router } from "express";
import Auth


const router = Router();

router.use("/auth", AuthRouter);

export default router;
