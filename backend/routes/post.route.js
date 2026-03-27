const express = require("express");
const controller = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

const router = express.Router();
// Lấy tất cả bài viết
router.get("/", controller.getPosts);
// Đọc chi tiết 1 bài post
router.get("/:id", controller.getDetailPost);
// search post theo keyword
router.get("/search/:keywords", controller.getPostByKeyword);
// search post theo category
router.get("/category/:categorySlug", controller.getPostByCategory);
// search post theo tag
router.get("/tag/:tagSlug", controller.getPostByTag);

router.post("/", upload.single("image"), verifyToken, allowRoles("author", "admin"), controller.createPost);
router.put("/:id", upload.single("image"), verifyToken, allowRoles("author","admin"), controller.updatePost);

router.delete("/:id",verifyToken, allowRoles("admin"), controller.deletePost);


module.exports = router;