const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
    {
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }   
        ],
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

module.exports = mongoose.Schema("Bookmark", bookmarkSchema);