import {validationResult, body} from "express-validator"

export const validateRequest = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    res.status(422).send({ errors: result.array() });
  }

export const expensesValidator = [
    body("description")
    .trim()
    .escape(),
    body("cost")
    .trim()
    .isString()
    .escape(),
    body("date")
    .notEmpty()
    .withMessage("Date required")
    .trim()
    .escape()
]