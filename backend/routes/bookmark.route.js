const express = require("express");
const controller = require("../controllers/bookmark.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const router = express.Router();

router.get("/", verifyToken, allowRoles("reader", "author"), controller.getAllBookmark);
router.post("/:postid", verifyToken, allowRoles("reader", "author"), controller.saveBookmark);
router.delete("/:bookmarkid", verifyToken, allowRoles("reader", "author"), controller.removeBookmark);
 
module.exports = router;