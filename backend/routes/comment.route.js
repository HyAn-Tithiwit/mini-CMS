const express = require("express");
const controller = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");
const { commentLimiter } = require("../middlewares/ratelimit.middleware");
const { spamFilter } = require("../middlewares/spam.middleware");

const router = express.Router();

router.get("/:postid", controller.getAllComment);
router.post("/",verifyToken, allowRoles("reader", "author"), commentLimiter, spamFilter, controller.createComment);
router.put("/:commentid", verifyToken, allowRoles("reader", "author"), controller.updateComment);
router.delete("/:commentid", verifyToken, allowRoles("reader", "author"), controller.deleteComment);

module.exports = router;