const router = require("express").Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.get("/users", verifyToken, allowRoles("admin"), controller.getUsers); //done
router.get("/users/:id", verifyToken, allowRoles("admin"), controller.getUserById); //done
router.post("/users", verifyToken, allowRoles("admin"), controller.createUser); //done
router.put("/users/:id", verifyToken, allowRoles("admin"), controller.updateUser); //done
router.delete("/users/:id", verifyToken, allowRoles("admin"), controller.deleteUser); //done

router.put("/users/:id/role", verifyToken, allowRoles("admin"), controller.updateRole); //đã sửa tí test lại
router.put("/users/:id/status", verifyToken, allowRoles("admin"), controller.updateStatus); // have error

module.exports = router;