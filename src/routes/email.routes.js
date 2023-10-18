import { Router } from "express";
import { sendEmail } from "../utils/emailSender.js";

const router = Router()

router.post('/contact', sendEmail)

export default router
