const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Category = require("../models/Category.model");
const Tag = require("../models/Tag.model");
const bcrypt = require("bcryptjs");

exports.getStatistics = async (_req, res) => {
  try {
    const users = await User.countDocuments({});
    const posts = await Post.countDocuments({});
    const categories = await Category.countDocuments({});
    const tags = await Tag.countDocuments({});

    res.status(200).json({
      message: "Get statistics successfully",
      data: {
        users,
        posts,
        categories,
        tags
      }
    })
  } catch(error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, role, status } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.json({ page, total, data: users });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.status(201).json({
      message: "Update role successfully",
      data: user
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    })
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    res.status(201).json({
      message: "Update status successfully",
      data: user
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    })
  }
};