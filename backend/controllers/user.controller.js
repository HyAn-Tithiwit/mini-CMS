const User = require("../models/User.model");
const Post = require("../models/Post.model");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    return res.status(200).json({
      message: "Get Info successfully",
      data: user
    });
  } catch(error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// Đổi lại thành update profile
exports.updateProfile = async (req, res) => {
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { status },
    { new: true }
  );

  res.status(201).json({
    message: "Update status successfully",
    data: user
  });
};

// Update reader lên author
exports.updateRoleToAuthor = async (req, res) => {
  try {
    console.log(req.user);
    const userid = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userid,
      { role: "author" },
      { new: true }
    );

    return res.status(200).json({
      message: "Upgrade role to author successfully",
      data: user
    });
  } catch(error) {
    console.log(error);
    return res.status(500).json({
      message: "Interal server error"
    });
  }
}

// Submit post to review status (Author role)
exports.submitPostToEditor = async (req, res) => {
  try {
    const { postid } = req.params;

    if (!postid) {
      return res.status(400).json({
        message: "Bad request"
      });
    }

    const post = await Post.findByIdAndUpdate(
      postid,
      { status: "review" },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(201).json({
      message: "Submit to review status successfully",
      data: post
    });
  } catch(error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error"
      });
  }
}