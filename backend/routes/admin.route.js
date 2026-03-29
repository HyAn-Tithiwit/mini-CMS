const router = require("express").Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.get("/statistics", verifyToken, allowRoles("admin"), controller.getStatistics);

router.get("/users", verifyToken, allowRoles("admin"), controller.getUsers);
router.get("/users/:id", verifyToken, allowRoles("admin"), controller.getUserById);
router.post("/users", verifyToken, allowRoles("admin"), controller.createUser);
router.put("/users/:id", verifyToken, allowRoles("admin"), controller.updateUser);
router.delete("/users/:id", verifyToken, allowRoles("admin"), controller.deleteUser);
router.put("/users/:id/role", verifyToken, allowRoles("admin"), controller.updateRole);
router.put("/users/:id/status", verifyToken, allowRoles("admin"), controller.updateStatus);

module.exports = router;