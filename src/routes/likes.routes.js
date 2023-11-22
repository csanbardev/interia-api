import { Router } from "express";
import { getLikes, isLiked } from "../controllers/likes.controller.js";
import  {userExtractor} from "../middleware/auth.js";


const router = Router()

router.get('/likes/:id', getLikes)

router.get('/likes/liked/:id', userExtractor, isLiked)


export default router