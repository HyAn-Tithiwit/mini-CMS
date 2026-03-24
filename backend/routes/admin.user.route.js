const router = require("express").Router();
const controller = require("../controllers/admin.user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbac.middleware");

router.use(verifyToken, allowRoles("admin"));

router.get("/users", controller.getUsers); //done
router.get("/users/:id", controller.getUserById); //done
router.post("/users", controller.createUser);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser); //done

router.patch("/users/:id/role", controller.updateRole);
router.patch("/users/:id/status", controller.updateStatus); // have error

router.post("/category", controller.createCategory); //done

router.post("/tag", controller.createTag); //done

module.exports = router;