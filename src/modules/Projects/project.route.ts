import { Router } from "express";
import { checkAuth } from "../../middleware/auth";
import { ProjectController } from "./project.controller";

const router = Router();

router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getProjectById);

router.post("/", checkAuth, ProjectController.createProject);
router.patch("/:id", checkAuth, ProjectController.updateProject);
router.delete("/:id", checkAuth, ProjectController.deleteProject);

export const ProjectRoutes = router;
