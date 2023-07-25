import { Router } from "express";
import { getAllUsers, getUser, deleteUser, updateUser, createUser } from "../controllers/users.controller.js"
import { userExtractor, adminAccess } from "../middleware/auth.js";
import { validateUser, validateUpUser } from "../validators/users.validator.js";


const router = Router()

router.get('/users', adminAccess, getAllUsers)

router.get('/users/:id', userExtractor, getUser)

router.post('/users', validateUser, createUser)

router.patch('/users/:id', userExtractor, validateUpUser, updateUser)

router.delete('/users/:id', userExtractor, deleteUser)

export default router


