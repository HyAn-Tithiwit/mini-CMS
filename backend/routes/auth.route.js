const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.post("/register", registerValidator, validate, controller.register);
router.post("/login", loginValidator, validate, controller.login);
router.post("/refresh-token", controller.refreshToken);
router.post("/logout", controller.logout);
router.post("/forgot-password", controller.forgotPassword); // chưa test
router.post("/reset-password", controller.resetPassword); // chưa test

module.exports = router;