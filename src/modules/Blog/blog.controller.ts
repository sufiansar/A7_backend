import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";

const createBlog = asyncHandler(async (req: Request, res: Response) => {
  let payload: any;
  if (req.body.data) {
    payload = JSON.parse(req.body.data);
  } else {
    payload = { ...req.body };
  }

  if (req.file) {
    payload.picture = (req.file as any).path;
  }
  const userId = (req as any).user.id;
  const blog = await BlogServices.createBlog(userId, payload);

  sendResponse(res, {
    success: true,
    successCode: 201,
    message: "Blog created successfully",
    data: blog,
  });
});

const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await BlogServices.getAllBlogs();

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Blogs fetched successfully",
    data: blogs,
  });
});

const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await BlogServices.getBlogById(blogId);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Blog fetched successfully",
    data: blog,
  });
});

const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const payload = req.body;

  const blog = await BlogServices.updateBlog(blogId, payload);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Blog updated successfully",
    data: blog,
  });
});

const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const blogId = req.params.id;

  const blog = await BlogServices.deleteBlog(blogId);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Blog deleted successfully",
    data: blog,
  });
});
export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
