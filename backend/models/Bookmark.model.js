const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },  
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        savedAt: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model("Bookmark", bookmarkSchema);