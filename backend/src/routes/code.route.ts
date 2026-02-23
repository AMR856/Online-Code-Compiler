import { Router } from "express";
import { CodeController } from "../controllers/code.controller";
const router = Router();

router.post('/execute', CodeController.execute);
router.get('/:jobId', CodeController.getResult);
export default router;