import { Router } from "express";
import { checkAuth } from "../../middleware/auth";
import { BlogController } from "./blog.controller";

const router = Router();

router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);

router.post("/", checkAuth, BlogController.createBlog);
router.patch("/:id", checkAuth, BlogController.updateBlog);
router.delete("/:id", checkAuth, BlogController.deleteBlog);

export const BlogRoutes = router;
