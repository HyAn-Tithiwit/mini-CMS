const { body } = require("express-validator");

exports.registerValidator = [
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),

  body("username")
    .notEmpty(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirmpassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];

exports.loginValidator = [
    body("email").isEmail().withMessage("Email must be valid").notEmpty(),
    body("password").notEmpty()
];