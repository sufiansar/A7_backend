import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { ProjectServices } from "./project.service";
import { sendResponse } from "../../utils/sendResponse";

// const createProject = asyncHandler(async (req: Request, res: Response) => {
//   let payload: any;
//   if (req.body.data) {
//     payload = JSON.parse(req.body.data);
//   } else {
//     payload = { ...req.body };
//   }

//   if (req.file) {
//     payload.imageUrl = (req.file as any).path;
//   }
//   const userId = (req as any).user.id;
//   const project = await ProjectServices.createProject(userId, payload);

//   sendResponse(res, {
//     success: true,
//     successCode: 201,
//     message: "Project created successfully",
//     data: project,
//   });
// });

// ...existing code...
const createProject = asyncHandler(async (req: Request, res: Response) => {
  let payload: any;
  if (req.body.data) {
    payload = JSON.parse(req.body.data);
  } else {
    payload = { ...req.body };
  }

  if (
    req.files &&
    Array.isArray(req.files) &&
    (req.files as any[]).length > 0
  ) {
    payload.imageUrls = (req.files as any[]).map((f) => f.path);
  } else if (req.file) {
    payload.imageUrl = (req.file as any).path;
  }

  const userId = (req as any).user.id;
  const project = await ProjectServices.createProject(userId, payload);

  sendResponse(res, {
    success: true,
    successCode: 201,
    message: "Project created successfully",
    data: project,
  });
});
// ...existing code...

const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await ProjectServices.getAllProjects();

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Projects fetched successfully",
    data: projects,
  });
});

const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const project = await ProjectServices.getProjectById(projectId);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Project fetched successfully",
    data: project,
  });
});

// const updateProject = asyncHandler(async (req: Request, res: Response) => {
//   const projectId = req.params.id;

//   let payload: any;
//   if (req.body.data) {
//     payload = JSON.parse(req.body.data);
//   } else {
//     payload = { ...req.body };
//   }

//   if (req.file) {
//     payload.imageUrl = (req.file as any).path;
//   }

//   const project = await ProjectServices.updateProject(projectId, payload);

//   sendResponse(res, {
//     success: true,
//     successCode: 200,
//     message: "Project updated successfully",
//     data: project,
//   });
// });

const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.id;

  let payload: any;
  if (req.body.data) {
    payload = JSON.parse(req.body.data);
  } else {
    payload = { ...req.body };
  }

  if (
    req.files &&
    Array.isArray(req.files) &&
    (req.files as any[]).length > 0
  ) {
    payload.imageUrls = (req.files as any[]).map((f) => (f as any).path);
  } else if (req.file) {
    payload.imageUrl = (req.file as any).path;
  }

  const project = await ProjectServices.updateProject(projectId, payload);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Project updated successfully",
    data: project,
  });
});

const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.id;

  const project = await ProjectServices.deleteProject(projectId);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Project deleted successfully",
    data: project,
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
