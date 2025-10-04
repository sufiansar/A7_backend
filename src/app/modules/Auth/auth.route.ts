import { Router } from "express";

import { checkAuth } from "../../middleware/auth";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", checkAuth, AuthController.logout);

export const AuthRoutes = router;
