import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  if (!secret || secret.trim() === "") {
    throw new Error("JWT secret must be provided and cannot be empty");
  }

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  if (!secret || secret.trim() === "") {
    throw new Error("JWT secret must be provided and cannot be empty");
  }

  return jwt.verify(token, secret) as JwtPayload;
};

export const createUserToken = (user: { id: string; email: string }) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || jwtSecret.trim() === "") {
    throw new Error("JWT_SECRET environment variable is required");
  }

  if (!jwtRefreshSecret || jwtRefreshSecret.trim() === "") {
    throw new Error("JWT_REFRESH_SECRET environment variable is required");
  }

  const jwtPayload = {
    email: user.email,
    id: user.id,
  };

  const accessToken = generateToken(
    jwtPayload,
    jwtSecret,
    process.env.JWT_EXPIRE || "7d"
  );
  const refreshToken = generateToken(
    jwtPayload,
    jwtRefreshSecret,
    process.env.JWT_REFRESH_EXPIRE || "30d"
  );

  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtRefreshSecret || jwtRefreshSecret.trim() === "") {
    throw new Error("JWT_REFRESH_SECRET environment variable is required");
  }

  if (!jwtSecret || jwtSecret.trim() === "") {
    throw new Error("JWT_SECRET environment variable is required");
  }

  const decoded = verifyToken(refreshToken, jwtRefreshSecret);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) throw new Error("Admin user does not exist or is deleted");

  const jwtPayload = {
    email: user.email,
    id: user.id,
  };

  const accessToken = generateToken(
    jwtPayload,
    jwtSecret,
    process.env.JWT_EXPIRE || "7d"
  );
  return accessToken;
};
