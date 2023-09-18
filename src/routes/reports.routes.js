import { Router } from "express";
import { createReport, deleteReport, getReportedTutorials } from "../controllers/reports.controller.js";
import { adminAccess, userExtractor } from "../middleware/auth.js";

const router = Router()

router.post('/reports/:id', userExtractor, createReport)

router.get('/reports', adminAccess, getReportedTutorials)

router.delete('/reports/:id', adminAccess, deleteReport)

export default router