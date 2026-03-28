const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content_markdown: {
            type: String,
            required: true,
        },
        content_html: {
            type: String
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
                required: true
            }
        ],
        image: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["draft", "review", "published"],
            default: "draft"
        },
        author: {
            type: String, 
            required: true,
        },
        publishdate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);