import { Router } from "express";
import { checkAuth } from "../../middleware/auth";
import { ProjectController } from "./project.controller";
import { MulterUpload } from "../../config/multerCloudinary";

const router = Router();

router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getProjectById);

router.post(
  "/create",
  checkAuth,
  MulterUpload.single("file"),
  ProjectController.createProject
);
router.patch(
  "/:id",
  checkAuth,
  MulterUpload.single("file"),
  ProjectController.updateProject
);
router.delete("/:id", checkAuth, ProjectController.deleteProject);

export const ProjectRoutes = router;
