import { Router } from "express";
import { checkAuth } from "../../middleware/auth";
import { SkillController } from "./skill.controller";
import { MulterUpload } from "../../config/multerCloudinary";

const router = Router();

router.get("/", SkillController.getAllSkills);

router.post(
  "/create",
  checkAuth,
  MulterUpload.single("iconUrl"),
  SkillController.createSkill
);

router.patch("/:id", checkAuth, SkillController.updateSkill);
router.delete("/:id", checkAuth, SkillController.deleteSkill);
export const SkillRoutes = router;
