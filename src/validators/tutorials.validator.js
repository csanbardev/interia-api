import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelper.js";

export const validateTutorial = [
  check('title').exists().isLength({min: 2, max:20}).not().isEmpty().trim().escape(),
  check('description').exists().isLength({min: 12, max:100}).not().isEmpty().trim().escape(),
  check('url').exists().isLength({min: 12, max:30}).not().isEmpty().trim().escape(),
  check('published_date').exists().isDate(),
  check('id_category').exists().isNumeric().trim().escape(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]