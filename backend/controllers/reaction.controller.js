const Reaction = require("../models/Reaction.model");

exports.createReaction = async (req, res) => {
    try {
        const { commentid } = req.params;
        const userid = req.user.userId;
        if (!commentid) {
            return res.status(400).json({
                message: "Bad request"
            });
        }
        const reaction = await Reaction.create({
            comment: commentid,
            user: userid,
        });

        console.log("Reaction created");

        return res.status(201).json({
            message: "Reaction create successfully",
            data: reaction
        })
    } catch(error) {
        console.log(error);
        // nếu duplicate (đã like rồi)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Already liked this comment"
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

// Xóa reaction
exports.deleteReaction = async (req, res) => {
  try {
    const { commentid } = req.params;
    const userid = req.user.userId;
    console.log("req.user:", req.user);
    console.log("userid:", userid);

    const reaction = await Reaction.findOneAndDelete({
        user: userid,
        comment: commentid
    });

    if (!reaction) {
      return res.status(404).json({
        message: "Reaction not found"
      });
    }

    return res.status(200).json({
      message: "Unliked comment successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};