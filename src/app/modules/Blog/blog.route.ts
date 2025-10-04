import { Router } from "express";
import { checkAuth } from "../../middleware/auth";
import { BlogController } from "./blog.controller";
import { MulterUpload } from "../../config/multerCloudinary";

const router = Router();

router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);

router.post(
  "/create",
  checkAuth,
  MulterUpload.single("file"),
  BlogController.createBlog
);
router.patch(
  "/:id",
  checkAuth,
  MulterUpload.single("file"),
  BlogController.updateBlog
);
router.delete("/:id", checkAuth, BlogController.deleteBlog);

export const BlogRoutes = router;
