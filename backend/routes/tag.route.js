const router = require("express").Router();
const controller = require("../controllers/tag.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.get("/", controller.getAllTags);
router.post("/", verifyToken, allowRoles("admin", "editor"), controller.createTag);
router.delete("/:tagid", verifyToken, allowRoles("admin", "editor"), controller.deleteTag);

module.exports = router;