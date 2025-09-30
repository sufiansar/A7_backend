import express, { Application, Request, Response } from "express";
import cors from "cors";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { AuthRoutes } from "./modules/Auth/auth.route";
import { UserRoutes } from "./modules/User/user.route";
import { BlogRoutes } from "./modules/Blog/blog.route";
import { ProjectRoutes } from "./modules/Projects/project.route";
import { SkillRoutes } from "./modules/skills/skill.route";

dotenv.config();
const app: Application = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/blogs", BlogRoutes);
app.use("/api/v1/projects", ProjectRoutes);
app.use("/api/v1/skills", SkillRoutes);

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running Successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;
