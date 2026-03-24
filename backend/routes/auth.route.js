const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware"); // Middleware xác thực

// Các route hiện tại của bạn
router.post("/register", controller.register); //done
router.post("/login", controller.login); //done
router.post("/refresh-token", controller.refreshToken); //done
router.post("/logout", controller.logout); //done
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

// THÊM DÒNG NÀY: Endpoint để AuthContext gọi lấy thông tin user hiện tại
// Đường dẫn đầy đủ sẽ là: /api/auth/me
router.get("/me", protect, authController.getMe); 

module.exports = router;