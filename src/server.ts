import { Server } from "http";
import { PrismaClient } from "@prisma/client";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
let server: Server;

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

async function connection() {
  try {
    await prisma.$connect();
    console.info("Database connected successfully");

    server = app.listen(process.env.PORT || 5000, () => {
      console.log(
        `🚀 Application is listening on port ${process.env.PORT || 5000}`
      );
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("Server connection error:", err);
    process.exit(1);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        console.error("Unhandled Rejection:", error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    await prisma.$disconnect();
    server.close(() => {
      console.log("Process terminated");
    });
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT received. Shutting down gracefully...");
    await prisma.$disconnect();
    server.close(() => {
      console.log("Process terminated");
    });
  });
}

connection();
