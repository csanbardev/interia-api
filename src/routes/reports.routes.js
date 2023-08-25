import { Router } from "express";
import { createReport } from "../controllers/reports.controller.js";
import { userExtractor } from "../middleware/auth.js";

const router = Router()

router.post('/reports', userExtractor, createReport)

export default router