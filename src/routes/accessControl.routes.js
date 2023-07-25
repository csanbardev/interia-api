import { Router } from "express";
import { loginUser } from "../controllers/login.controller.js"
import { signupUser } from "../controllers/singup.controller.js";

const router = Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

export default router
