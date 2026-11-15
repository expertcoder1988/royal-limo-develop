import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";
import adminSchema from "../models/admin.js";
import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";

import mongoose from "mongoose";
import Blog from "../models/blogs.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("image");

export const uploadImage = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer", "").trim();

    if (!token) {
      return res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const admin = await adminSchema.findById(decodedToken.user.id);

    if (!admin) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    upload(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "Failed to upload file" });
      }

      const imageUrl = `/public/${req.file?.filename}`;
      res.status(200).json({
        message: "File uploaded successfully",
        imageUrl: imageUrl,
      });
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;

    const skip = (page - 1) * pageSize;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCount = await Blog.countDocuments();

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

export const getBlogsSitemap = async (req, res) => {
  try {
    const blogs = await Blog.find({}, { _id: 0, slug: 1, updatedAt: 1 });

    res.json({ blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blogs for sitemap" });
  }
};

export const createBlog = async (req, res) => {
  const { title, content, imageUrl, slug, imageAltText, metaDescription } =
    req.body;

  if (
    !title ||
    !content ||
    !imageUrl ||
    !slug ||
    !imageAltText ||
    !metaDescription
  ) {
    return res.status(400).json({
      error:
        "Title, content, and imageUrl, slug, imageAltText, metaDescription are required fields",
    });
  }

  try {
    const token = req.headers.authorization?.replace("Bearer", "").trim();

    if (!token) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }

    const existing_slug = await Blog.find({ slug });
    if (existing_slug.length > 0) {
      return res.status(400).send({ error: "Slug already in use." });
    }

    const data = jwt.verify(token, JWT_SECRET);

    const admin = await adminSchema.findById(data.user.id);

    const newBlog = new Blog({
      title,
      content,
      imageUrl,
      user: admin._id,
      slug,
      imageAltText,
      metaDescription,
    });
    const savedBlog = await newBlog.save();

    return res.status(201).json(savedBlog.toObject());
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const foundBlog = await Blog.findById(blogId);
    if (!foundBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const token = req.headers.authorization?.replace("Bearer", "").trim();

    if (!token) {
      return res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }

    const data = jwt.verify(token, JWT_SECRET);

    const admin = await adminSchema.findById(data.user.id);

    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const { title, content, metaDescription, imageAltText, imageUrl, slug } =
    req.body;
  const blogSlug = req.params.slug;

  try {
    const token = req.headers.authorization?.replace("Bearer", "").trim();

    if (!token) {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid token" });
    }
    const data = jwt.verify(token, JWT_SECRET);

    const admin = await adminSchema.findById(data.user.id);
    if (!admin) {
      return res
        .status(401)
        .send({ error: "Unauthorized. Admin privileges required." });
    }

    const existingBlog = await Blog.findOne({ slug: blogSlug });
    if (!existingBlog) {
      console.log(`Blog not found with slug: ${blogSlug}`);
      return res.status(404).json({ message: "Blog not found" });
    }
    const duplicateSlug = await Blog.findOne({
      slug,
      _id: { $ne: existingBlog._id },
    });

    if (duplicateSlug) {
      return res.status(400).json({ message: "Slug already in use" });
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: blogSlug },
      { title, content, metaDescription, imageAltText, imageUrl, slug },
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found or could not be updated" });
    }

    return res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const singleBlog = async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.find({ slug });

  if (!blog[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.status(200).json(blog[0]);
};

export const latestBlog = async (req, res) => {
  try {
    const latestBlog = await Blog.findOne({}, {}, { sort: { createdAt: -1 } });
    res.json({ blog: latestBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
