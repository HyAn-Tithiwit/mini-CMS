const router = require("express").Router();
const controller = require("../controllers/editor.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.get("/", verifyToken, allowRoles("editor"), controller.getPostWithReviewStatus);

router.put("/publish/:postid", verifyToken, allowRoles("editor"), controller.publishPost);
router.put("/reject/:postid", verifyToken, allowRoles("editor"), controller.rejectPost);

module.exports = router;