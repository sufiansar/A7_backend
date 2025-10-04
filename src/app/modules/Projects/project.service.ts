import prisma from "../../config/database";

const createProject = async (userId: string, payload: any) => {
  const { imageUrl, ...rest } = payload;

  const project = await prisma.project.create({
    data: {
      ...rest,
      imageUrl,
      authorId: userId,
    },
  });

  return project;
};

const getAllProjects = async () => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  return projects;
};

const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  if (!project) throw new Error("Project not found");
  return project;
};

const updateProject = async (id: string, payload: any) => {
  const project = await prisma.project.update({ where: { id }, data: payload });
  return project;
};

const deleteProject = async (id: string) => {
  const project = await prisma.project.delete({ where: { id } });
  return project;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
