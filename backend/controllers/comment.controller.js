const Comment = require("../models/Comment.model");

// Lấy tất cả comment có trong một bài post
exports.getAllComment = async (req, res) => {
    try {
        const { postid } = req.params;
        if(!postid) {
            return res.status(400).json({
                message: "Bad request"
            });
        }
        const comments =  await Comment.find({ post: postid });

        return res.status(200).json({
            message: "Successfully get all comment of a post",
            data: comments
        })
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Tạo comment
exports.createComment = async (req, res) => {
    try {
        const { post, user,  content, isSpam } = req.body;

        if (!post || !user || !content) {
            return res.status(400).json({
                message: "Bad request"
            });
        }
        const comment = await Comment.create({
            post,
            user,
            content, 
            isSpam
        });

        console.log("Comment created");

        return res.status(201).json({
            message: "Comment create successfully",
            data: comment
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

//Chỉnh sửa comment
exports.updateComment = async (req, res) => {
    try {
        const { commentid } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Doesn't have any data to update"
            });
        }

        const comment = await Comment.findByIdAndUpdate(
            commentid,
            { content },
            {
                new: true,
                runValidators: true
            }
        );

        if (!comment) {
            return res.status(404).json({
                message: "Comment doesn't exist"
            });
        }

        return res.status(200).json({
            message: "Update comment successfully",
            data: comment
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Xóa comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentid } = req.params;

    const comment = await Comment.findByIdAndDelete(commentid);

    if (!comment) {
      return res.status(404).json({
        message: "Comment doesn't exist"
      });
    }

    return res.status(200).json({
      message: "Delete comment successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};