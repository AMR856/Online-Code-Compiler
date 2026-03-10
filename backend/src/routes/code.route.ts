import { Router } from "express";
import { CodeController } from "../controllers/code.controller";
import { codeLimiter, jobIDLimiter } from "../utils/rateLimiter";
const router = Router();

router.post('/execute', codeLimiter, CodeController.execute);
router.get('/:jobId', jobIDLimiter, CodeController.getResult);
export default router;