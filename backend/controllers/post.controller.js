// Chưa đủ API

/* 
1. Lấy danh sách bài viết publish x
2. Chi tiết bài post x
3. Lấy danh sách bài viết theo category 
4. Lấy danh sách bài viết theo tag 
*/

const Post = require("../models/Post.model");
const Category = require("../models/Category.model");
const Tag = require("../models/Tag.model");

// Lấy tất cả bài posts
exports.getPosts = async (_req, res) => {
    try {
        const posts = await Post.find().sort({ createAt: -1});
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
        const detailPost = await Post.findById(req.params.id).select("title content slug category tags image author publishdate");
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
exports.createPost = async (req, res) => {
    try {

        const { title, content, slug, category, tags, author} = req.body;

        // const slugified = slug || title.toLowerCase().replace(/\s+/g, "-");    Tạo slug

        const imageurl = req.file ? req.file.path : null;

        if(!title && !content && !author) {
            res.status(400).json({
                message: "Doesn't have any data to create"
            });
        }

        const post = await Post.create({
            title,
            content,
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
        let { title, content, category, tags, author } = req.body;
        let image;

        if (tags) {
            if (!Array.isArray(tags)) {
                tags = [tags];
            }
        }

        const updateData = {
            title,
            content,
            category,
            tags,
            author
        };

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