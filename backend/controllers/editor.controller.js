const Post = require("../models/Post.model");

exports.getPostWithReviewStatus = async (req, res) => {
    try {
        const postWithReviewStatus = await Post.find({ status: "review" });

        return res.status(200).json({
            message: "Get review post successfully",
            data: postWithReviewStatus
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.publishPost = async (req, res) => {
    try {
        const { postid } = req.params;
    
        if (!postid) {
          return res.status(400).json({
            message: "Bad request"
          });
        }
    
        const post = await Post.findByIdAndUpdate(
          postid,
          { status: "published" },
          {
            new: true,
            runValidators: true
          }
        );
    
        return res.status(201).json({
          message: "Published post successfully",
          data: post
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.rejectPost = async (req, res) => {
    try {
        const { postid } = req.params;
    
        if (!postid) {
          return res.status(400).json({
            message: "Bad request"
          });
        }
    
        const post = await Post.findByIdAndUpdate(
          postid,
          { status: "draft" },
          {
            new: true,
            runValidators: true
          }
        );
    
        return res.status(201).json({
          message: "Reject post successfully",
          data: post
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}