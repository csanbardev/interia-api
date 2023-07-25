import { Router } from "express";
import { getLikes } from "../controllers/likes.controller.js";
import  {userExtractor} from "../middleware/auth.js";


const router = Router()

router.get('/likes/:id', userExtractor, getLikes)


export default router