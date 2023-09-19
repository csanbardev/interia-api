import { Router } from "express";
import { createCategory, getAllCategories, getPendingCategories, toApproveCategory, updateCategory } from "../controllers/categories.controller.js";
import { userExtractor, adminAccess } from "../middleware/auth.js";
import { uploadImage } from "../middleware/uploadImage.js";


const router = Router()

router.get('/categories', getAllCategories)

router.get('/categories/pending', adminAccess, getPendingCategories)

router.post('/categories', userExtractor, createCategory)

router.patch('categories/:id', adminAccess, updateCategory)

router.patch('/categories/pending/:id', adminAccess, uploadImage, toApproveCategory)

export default router


