require("dotenv").config();
const { connectMongo } = require('./config/db');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); //

const postRoute = require("./routes/post.route");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.user.route");

// Connect MongoDB
connectMongo(process.env.MONGO_URI);

const app = express();

// 1. CẤU HÌNH CORS (Phải đặt TRƯỚC các route)
app.use(cors({
  origin: 'http://localhost:5173', // Port của Frontend Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Cho phép gửi cookie/token
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 2. ĐĂNG KÝ ROUTE (Đảm bảo tất cả có tiền tố /api để đồng bộ với Frontend)
app.use("/api/posts", postRoute); // Đã thêm /api vào trước
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

// 3. XỬ LÝ LỖI 404 (Trả về JSON thay vì render trang lỗi)
app.use(function(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} không tồn tại trên Server.`
  });
});

// 4. ERROR HANDLER CHUNG (Trả về JSON)
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;