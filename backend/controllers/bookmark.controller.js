const Bookmark = require("../models/Bookmark.model");

exports.getAllBookmark = async (req, res) => {
    try {
        const userid = req.user.userId;

        if (!userid) {
            return res.status(400).json({
                message: "Bad request"
            });
        }

        const bookmarks = await Bookmark.find({ user: userid });

        return res.status(200).json({
            message: "Get your bookmarks successfully",
            data: bookmarks
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.saveBookmark = async (req, res) => {
    try {
        const { postid } = req.params;
        const userid = req.user.userId;

        if (!userid) {
            return res.status(400).json({
                message: "Bad request"
            });
        }

        const bookmark = await Bookmark.create({
            post: postid,
            user: userid
        });
        console.log("Bookmark saved");

        return res.status(201).json({
            message: "Bookmark save successfully",
            data: bookmark
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.removeBookmark = async (req, res) => {
    try {
        const { bookmarkid } = req.params;
        
        const bookmark = await Bookmark.findByIdAndDelete(bookmarkid);
        
        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark doesn't exist"
            });
        }
        
        return res.status(200).json({
            message: "Delete bookmark successfully",
        });
    } catch(error) {
        console.log(error),
        res.status(500).json({
            message: "Internal server error"
        });
    }
}