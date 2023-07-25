import { validationResult } from "express-validator";

export const validateResult = (req, res, next) =>{
  try {
    validationResult(req).throw()
    next()
  } catch (error) {
    return res.status(403).json({ error })
  }
}