import { Router } from "express";
import { getAllTutorials, getTutorial, deleteTutorial, updateTutorial, createTutorial, getAllUserTutorials, getPendingTutorials, likeTutorial, getLikesTutorials, getLimitedTutorials } from "../controllers/tutorials.controller.js"
import { userExtractor, adminAccess } from "../middleware/auth.js";
import { uploadImage } from "../middleware/uploadImage.js";
import { obtainVidData } from "../middleware/urlUnpack.js";

const router = Router()

router.get('/tutorials', getAllTutorials)

router.get('/tutorials/filter', getLimitedTutorials)

router.get('/tutorials/pending', adminAccess, getPendingTutorials)

router.get('/tutorials/likes/:id', userExtractor, getLikesTutorials)

router.get('/tutorials/:id', getTutorial)

router.get('/tutorials/user/:id', userExtractor, getAllUserTutorials)



router.post('/tutorialsImg', uploadImage, (req, res) => {
  if(!req.file){
    return res.status(400)
  }

  res.send(req.file.path)
})

router.post('/tutorials', userExtractor,  obtainVidData, createTutorial)

router.patch('/tutorials/:id/like', userExtractor, likeTutorial)

router.patch('/tutorials/:id', userExtractor, updateTutorial)

router.delete('/tutorials/:id', userExtractor, deleteTutorial)

export default router


