const router = require("express").Router();
const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/me", verifyToken, controller.getMe); // have error
router.put("/me", verifyToken, controller.updateStatus);

module.exports = router;