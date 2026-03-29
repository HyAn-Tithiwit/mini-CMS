const router = require("express").Router();
const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.get("/me", verifyToken, allowRoles("reader", "author"), controller.getProfile);

router.put("/me", verifyToken, allowRoles("reader", "author"), controller.updateProfile);

router.put("/me/author", verifyToken, allowRoles("reader"), controller.updateRoleToAuthor);

// api submit post lên cho editor review
router.put("/me/:postid", verifyToken, allowRoles("author"), controller.submitPostToEditor);

module.exports = router;