const recentComments = new Map();

exports.spamFilter = (req, res, next) => {
  const userId = req.user.userId;
  const content = req.body.content;

  const last = recentComments.get(userId);

  if (last && last.content === content && Date.now() - last.time < 10000) {
    return res.status(429).json({
      message: "Duplicate comment detected"
    });
  }

  recentComments.set(userId, {
    content,
    time: Date.now()
  });

  next();
};