import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";
import { CustomJwtPayload } from "../interface/types";

const prisma = new PrismaClient();

const authenticateUser = async (
  req: Request
): Promise<{ id: string; email: string; name: string } | null> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if ((req as any).cookies?.accessToken) {
    token = (req as any).cookies.accessToken;
  }

  if (!token) return null;

  const decoded = verifyToken(
    token,
    process.env.JWT_SECRET!
  ) as CustomJwtPayload;

  return prisma.user.findUnique({
    where: decoded.id ? { id: decoded.id } : { email: decoded.email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
};

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authenticateUser(req);

    if (!user) {
      return sendResponse(res, {
        success: false,
        successCode: 401,
        message: "User not authenticated",
        data: null,
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authenticateUser(req);

    if (!user) {
      return sendResponse(res, {
        success: false,
        successCode: 401,
        message: "Not authorized to access this route",
        data: null,
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    sendResponse(res, {
      success: false,
      successCode: 500,
      message: "Server error in authentication",
      data: null,
    });
  }
};
