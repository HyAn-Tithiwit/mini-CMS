const rateLimit = require("express-rate-limit");

exports.commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 3, // tối đa 5 comment / phút / user
  message: {
    message: "Too many comments, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.user?.userId) {
      return `user:${req.user.userId}`;
    }

    return ipKeyGenerator(req);
  }
});