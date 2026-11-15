import express from "express";
import {
  createBlog,
  getBlogs,
  uploadImage,
  deleteBlog,
  updateBlog,
  singleBlog,
  latestBlog,
  getBlogsSitemap,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/blogs", getBlogs);

router.get("/blogs-sitemap", getBlogsSitemap);

router.get("/latest", latestBlog);

router.get("/blog/:slug", singleBlog);

router.post("/blog", createBlog);

router.post("/upload-image", uploadImage);

router.delete("/delete-blog/:id", deleteBlog);

router.put("/update-blog/:slug", updateBlog);

export { router as blogRouter };
