import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import bcrypt from "bcryptjs";
import { IUser } from "../../interface/types";
import { createUserToken } from "../../utils/jwt";

const prisma = new PrismaClient();

const registerUser = async (payload: Partial<IUser>) => {
  const { email, password, name, picture } = payload;

  if (!email || !password || !name) {
    throw new AppError(400, "Email, name, and password are required");
  }

  const isEmailExist = await prisma.user.findUnique({ where: { email } });
  if (isEmailExist) {
    throw new AppError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      picture,
    },
  });

  const tokens = createUserToken({ id: user.id, email: user.email });

  const users = {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: users, tokens };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const { email, password, name } = payload;

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) throw new AppError(404, "User not found");

  let hashedPassword = existingUser.password;
  if (password) {
    hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: email ?? existingUser.email,
      name: name ?? existingUser.name,
      password: hashedPassword,
    },
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");

  await prisma.user.delete({ where: { id: userId } });

  return true;
};

export const UserServices = {
  registerUser,
  updateUser,
  deleteUser,
  getMe,
};
