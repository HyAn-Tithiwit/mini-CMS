const router = require("express").Router();
const controller = require("../controllers/category.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.post("/", verifyToken, allowRoles("admin", "editor"), controller.createCategory);
router.delete("/:categoryid", verifyToken, allowRoles("admin", "editor"), controller.deleteCategory);

module.exports = router;