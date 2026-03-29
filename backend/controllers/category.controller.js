const Category = require("../models/Category.model");
const GenerateSlug = require("../utils/generate-slug");

// Lấy toàn bộ category
exports.getCateogories = async (_req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json({
            message: "Get all categories succsessfully",
            data: categories
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Tạo category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let slug;
        if (name) {
            slug = await GenerateSlug.generateSlug(name);
        } else {
            res.status(500).json({
                message: "Generate slug error"
            })
        }

        const category = await Category.create({
            name,
            slug,
            description
        });

        res.status(201).json({
            message: "Create category successfully",
            data: category
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Xóa category
exports.deleteCategory = async (req, res) => {
    try {
        const { categoryid } = req.params;

        const category = await Category.findByIdAndDelete(categoryid);

        if (!categoryid) {
            return res.status(404).json({
                message: "Category doesn't exist"
            });
        }

        return res.status(200).json({
            message: "Delete category successfully",
            data: category
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}