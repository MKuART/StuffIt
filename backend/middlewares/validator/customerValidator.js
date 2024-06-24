import {validationResult, body} from "express-validator"

export const validateRequest = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    res.status(422).send({ errors: result.array() });
  }

export const customerValidator = [
  body("firstname")
    .notEmpty()
    .withMessage("Vorname muss angegeben werden!")
    .trim()
    .escape(),
    body("lastname")
    .notEmpty()
    .withMessage("Nachname muss angegeben werden!")
    .trim()
    .isString()
    .escape(),
    body("password")
    .notEmpty()
    .withMessage("Passwort muss angegeben werden!")
    .trim()
    .isStrongPassword()
    .withMessage(`Passwort ist nicht sicher genug! 
        Ein Grossbuchstabe, Zahl und 
        Zeichen muss vorhanden sein!`)
    .isLength({min: 8})
    .withMessage("Passwort muss mindestens 8 Zeichen lang sein!")
    .escape(),
    body("email")
    .notEmpty()
    .withMessage("Email muss angegeben werden!")
    .trim()
    .isEmail()
    .withMessage("Verwende eine richtige Email-Adresse!")
    .normalizeEmail()
    .escape()
]

export const customerUpdateValidator = (fieldsToUpdate) => {
  const validators = [];

  if (fieldsToUpdate.includes("firstname")) {
    validators.push(
      body("firstname")
        .if(body("firstname").exists({ checkFalsy: true }))
        .trim()
        .isString()
        .escape()
    );
  }

  if (fieldsToUpdate.includes("lastname")) {
    validators.push(
      body("lastname")
        .if(body("lastname").exists({ checkFalsy: true }))
        .trim()
        .isString()
        .escape()
    );
  }

  if (fieldsToUpdate.includes("password")) {
    validators.push(
      body("password")
        .if(body("password").exists({ checkFalsy: true }))
        .trim()
        .isStrongPassword()
        .withMessage("Password is not safe enough")
        .isLength({ min: 8 })
        .escape()
    );
  }

  if (fieldsToUpdate.includes("email")) {
    validators.push(
      body("email")
        .if(body("email").exists({ checkFalsy: true }))
        .trim()
        .isEmail()
        .normalizeEmail()
        .escape()
    );
  }

  return validators;
};