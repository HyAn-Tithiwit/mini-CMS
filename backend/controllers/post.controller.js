const Post = require("../models/Post.model");
const Category = require("../models/Category.model");
const Tag = require("../models/Tag.model");
const GenerateSlug = require("../utils/generate-slug");
const { processContent } = require("../utils/handle-content");

// Lấy tất cả bài posts
exports.getPosts = async (req, res) => {
    try {
        // 1. Query params
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            status,
            author,
            fromDate,
            toDate
        } = req.query;

        // 2. Pagination
        const skip = (page - 1) * limit;
        
        // 3. Build filter object
        let filter = {};

        if (status) {
            filter.status = status;
        }

        if (author) {
            filter.author = author;
        }

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) filter.createdAt.$lte = new Date(toDate);
        }

        // 4. Sorting
        const sortOption = {
            [sortBy]: order === "desc" ? -1 : 1
        };

        const posts = await Post.find().sort(sortOption).skip(skip).limit(parseInt(limit));

        return res.status(200).json({
            message: "Successfully to get posts",
            data: posts
        });
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Đọc chi tiết bài post
exports.getDetailPost = async (req, res) => {
    try {
        const detailPost = await Post.findById(req.params.id).select("title summary content_html slug status category tags image author publishdate").populate("category", "name");
        return res.status(200).json({
            message: "Successfully to get content",
            data: detailPost
        })
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Lấy các posts theo category
exports.getPostByCategory = async (req, res) => {
    try {
        const { categorySlug } = req.params;
        if(!categorySlug) {
            return res.status(400).json({
                message: "Bad request"
            });
        }
        const category_id = await Category.findOne({ slug: categorySlug }).select("_id");

        if(!category_id) {
            return res.status(400).json({
                message: "Category not found"
            })
        }
        const posts =  await Post.find({ category: category_id._id });

        return res.status(200).json({
            message: "Successfully get posts by category",
            data: posts
        })
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Lấy các posts theo tag
exports.getPostByTag = async (req, res) => {
    try {
        const { tagSlug } = req.params;
        if(!tagSlug) {
            return res.status(400).json({
                message: "Bad request"
            });
        }
        const tag_id = await Tag.findOne({ slug: tagSlug }).select("_id");

        if(!tag_id) {
            return res.status(400).json({
                message: "Tag not found"
            })
        }
        const posts =  await Post.find({ tags: tag_id._id });

        return res.status(200).json({
            message: "Successfully get posts by tag",
            data: posts
        })
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Search post theo keyword
exports.getPostByKeyword = async (req, res) => {
    try {
        const { keywords } = req.params;
        if(!keywords) {
            return res.status(400).json({
                message: "Bad request"
            });
        }
        const keywordArray = keywords.split(" ");
        const posts =  await Post.find({
            $or: keywordArray.map(word => ({
                title: { $regex: word, $options: "i"}
            }))
        }).limit(10);

        return res.status(200).json({
            message: "Successfully",
            data: posts
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Tạo post mới
// Phát triển tiếp
exports.createPost = async (req, res) => {
    try {

        const { title, summary, content, category, tags, author} = req.body;

        let slug = await GenerateSlug.generateSlug(title);

        if (!slug) {
            return res.status(500).json({
                message: "Slug generate failed"
            })
        }

        const cleanHtml = processContent(content);

        const imageurl = req.file ? req.file.path : null;

        if(!title || !content || !author) {
            res.status(400).json({
                message: "Doesn't enough data to create post"
            });
        }

        const post = await Post.create({
            title,
            summary,
            content_markdown: content,
            content_html: cleanHtml,
            slug,
            category,
            tags,
            author,
            image: imageurl
        });

        console.log("Post created");

        res.status(200).json({
            message: "Create post successfully",
            data: post
        });
    } catch(error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

//Chỉnh sửa post
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        let { title, summary, content, category, tags, author } = req.body;
        let image;
        let slug;

        if (title) {
            slug = await GenerateSlug.generateSlug(title);
        }

        if (tags) {
            if (!Array.isArray(tags)) {
                tags = [tags];
            }
        }

        const cleanHtml = processContent(content);

        const updateData = {
            title,
            summary,
            content_markdown: content,
            content_html: cleanHtml,
            category,
            tags,
            author
        };

        if (slug) {
            updateData.slug = slug;
        }

        if (req.file) {
            image = req.file;
            updateData.image = req.file.path;
        }

        if (!title && !content && !author && !category && !image) {
            return res.status(400).json({
                message: "Doesn't have any data to update"
            });
        }

        const post = await Post.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!post) {
            return res.status(404).json({
                message: "Post doesn't exist"
            });
        }

        return res.status(200).json({
            message: "Update post successfully",
            data: post
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Xóa post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        message: "Post doesn't exist"
      });
    }

    return res.status(200).json({
      message: "Delete post successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};