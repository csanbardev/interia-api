import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelper.js";


export const validateUser = [
  check('nick').exists().isLength({min: 4, max: 16}).not().isEmpty().trim().escape(),
  check('email').exists().isEmail().normalizeEmail(),
  check('password').exists().not().isEmpty(),
  check('role').optional().trim(),
  // TODO: role must have custom validator: must be admin or user
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

export const validateUpUser = [
  check('nick').optional().isLength({min: 4, max: 16}).not().isEmpty().trim().escape(),
  check('email').optional().isEmail().normalizeEmail(),
  check('password').optional().not().isEmpty(),
  check('role').optional().trim(),
  // TODO: role must have custom validator: must be admin or user
  (req, res, next) => {
    validateResult(req, res, next)
  }
]
