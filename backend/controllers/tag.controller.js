const Tag = require("../models/Tag.model");
const GenerateSlug = require("../utils/generate-slug");

// Tạo Tag
exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        let slug;
        if (name) {
            slug = await GenerateSlug.generateSlug(name);
        } else {
            res.status(500).json({
                message: "Generate slug error"
            })
        }

        const tag = await Tag.create({
            name,
            slug
        });

        res.status(201).json({
            message: "Create tag successfully",
            data: tag
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Xóa tag
exports.deleteTag = async (req, res) => {
    try {
        const { tagid } = req.params;

        const tag = await Tag.findByIdAndDelete(tagid);

        if (!tag) {
            return res.status(404).json({
                message: "Category doesn't exist"
            });
        }

        return res.status(200).json({
            message: "Delete tag successfully",
            data: tag
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}