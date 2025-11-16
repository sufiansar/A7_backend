import { Router } from "express";
import { ContactController } from "./contact.controller";

const router = Router();

router.post("/send", ContactController.sendContact);

export const ContactRoutes = router;
