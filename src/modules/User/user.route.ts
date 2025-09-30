import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/auth";
import { MulterUpload } from "../../config/multerCloudinary";

const router = Router();

router.post(
  "/register",
  MulterUpload.single("file"),
  UserControllers.registerUser
);
router.put("/:id", UserControllers.updateUser);
router.delete("/:id", UserControllers.deleteUser);
router.get("/me", checkAuth, UserControllers.getMe);
export const UserRoutes = router;
