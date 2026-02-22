import { Router } from "express";
import { CodeController } from "../controllers/code.controller";
const router = Router();

router.post('/execute', CodeController.execute);

export default router;