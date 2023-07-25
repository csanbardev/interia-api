import { Router } from "express";
import { createCategory, getAllCategories, updateCategory } from "../controllers/categories.controller.js";
import { userExtractor, adminAccess } from "../middleware/auth.js";


const router = Router()

router.get('/categories', getAllCategories)



router.post('/categories', userExtractor, createCategory)

router.patch('categories/:id', adminAccess, updateCategory)


export default router


