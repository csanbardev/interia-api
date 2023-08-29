import { Router } from "express";
import { getAllUsers, getUser, deleteUser, updateUser, createUser, updateAvatar } from "../controllers/users.controller.js"
import { userExtractor, adminAccess } from "../middleware/auth.js";
import { validateUser, validateUpUser } from "../validators/users.validator.js";
import { uploadImage } from "../middleware/uploadImage.js";


const router = Router()

router.get('/users', adminAccess, getAllUsers)

router.get('/users/:id', userExtractor, getUser)

router.post('/users', validateUser, createUser)

router.patch('/userAvatar/:id', userExtractor, uploadImage, updateAvatar)

router.patch('/users/:id', userExtractor, validateUpUser, updateUser)

router.delete('/users/:id', userExtractor, deleteUser)

export default router


