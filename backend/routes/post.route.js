const express = require("express");
const controller = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();
// CRUD đơn giản cho post
router.get("/", controller.getPosts);
router.get("/:id", controller.getDetailPost);
router.post("/", upload.single("image"), controller.createPost);
router.put("/:id", upload.single("image"), controller.updatePost);
router.delete("/:id", controller.deletePost);

// search post theo keyword
router.get("/search/:keywords", controller.getPostByKeyword);
// search post theo category
router.get("/category/:categorySlug", controller.getPostByCategory);
// search post theo tag
router.get("/tag/:tagSlug", controller.getPostByTag);

module.exports = router;