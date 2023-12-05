const { body, validationResult } = require("express-validator")

const validate = (validations) => {
    return async (req, res, next) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res
        .status(400)
        .send({ message: "An error occurs", errors: errors.array() });
    };
  };

module.exports = {
    validateLogin: validate([
        body("email").isEmail().notEmpty().withMessage("Email is required"),
        body("password").notEmpty().withMessage("Password is required")
    ]),
    validateRegisterEmployee: validate([
        body("email").isEmail().notEmpty().withMessage("Email is required"),
        body("salary").isNumeric().notEmpty().withMessage("Salary is required")
    ]),
    validateSetPassword: validate([
        body("fullName").isString().notEmpty().withMessage("Full Name is required"),
        body("dateOfBirth").isDate().notEmpty().withMessage("Date of Birth is required"),
        body("password")
        .isLength({ min: 8 })
        .withMessage("minimum password length is 8 characters")
        .isStrongPassword({
          minSymbols: 0,
        })
        .withMessage(
          "password must contain 1 uppercase, 1 lowercase and 1 number"
        ),
        body("confirmPassword")
        .notEmpty()
        .withMessage("confirm password is required")
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            return false;
          }
          return true;
        })
        .withMessage("password does not match"),
    ])
}