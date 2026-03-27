const express = require("express");
const controller = require("../controllers/reaction.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const router = express.Router();

router.post("/:commentid", verifyToken, allowRoles("author", "reader"), controller.createReaction);
router.delete("/:commentid", verifyToken, allowRoles("author", "reader"), controller.deleteReaction);

module.exports = router;