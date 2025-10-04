import prisma from "../../config/database";
const createBlog = async (userId: string, payload: any) => {
  const { coverImage, ...rest } = payload;
  const slug = rest.title.toLowerCase().replace(/\s+/g, "-");

  const blog = await prisma.blog.create({
    data: {
      ...rest,
      coverImage,
      slug,
      authorId: userId,
    },
  });

  return blog;
};

const getAllBlogs = async () => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  return blogs;
};

const getBlogById = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  if (!blog) throw new Error("Blog not found");
  return blog;
};

const updateBlog = async (id: string, payload: any) => {
  const blog = await prisma.blog.update({ where: { id }, data: payload });
  return blog;
};

const deleteBlog = async (id: string) => {
  const blog = await prisma.blog.delete({ where: { id } });
  return blog;
};

export const BlogServices = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
