import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  createUserToken,
  createNewAccessTokenWithRefreshToken,
} from "../../utils/jwt";

const prisma = new PrismaClient();

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResult {
  user: { id: string; email: string; name: string };
  tokens: AuthTokens;
}

const credentialsLogin = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) throw new Error("User does not exist");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect password");

  const tokens = createUserToken(user);
  const { password: _pass, ...rest } = user;
  return { user: rest, tokens };
};

const getNewAccessToken = async (
  refreshToken: string
): Promise<{ tokens: AuthTokens }> => {
  if (!refreshToken) throw new Error("No refresh token provided");

  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  const tokens: AuthTokens = {
    accessToken,
    refreshToken, // Keep the same refresh token
  };

  return { tokens };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password does not match");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
};
