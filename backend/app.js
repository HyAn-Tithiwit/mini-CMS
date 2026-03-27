require("dotenv").config();
const { connectMongo } = require('./config/db');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const postRoute = require("./routes/post.route");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");
const editorRoute = require("./routes/editor.route");
const categoryRoute = require("./routes/category.route");
const tagRoute = require("./routes/tag.route");
const commentRoute = require("./routes/comment.route");
const reactionRoute = require("./routes/reaction.route");
const bookmarkRoute = require("./routes/bookmark.route");

//Connect MongoDB
connectMongo(process.env.MONGO_URI);
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:5173', // domain frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // nếu dùng cookie, auth
}));

// Assign routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/editor", editorRoute);
app.use("/api/category", categoryRoute);
app.use("/api/tag", tagRoute);
app.use("/api/comment", commentRoute);
app.use("/api/reaction", reactionRoute);
app.use("/api/bookmark", bookmarkRoute);

module.exports = app;