import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { AuthServices } from "./auth.service";
import { setAuthCookies } from "../../utils/setAuthCookies";
import { sendResponse } from "../../utils/sendResponse";

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthServices.credentialsLogin(email, password);
  console.log(result);

  setAuthCookies(res, result.tokens);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Admin logged in successfully",
    data: {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    },
  });
});

const logout = asyncHandler(async (_req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  const isSecure = isProd || process.env.COOKIE_SECURE === "true";
  const sameSite = isProd ? "none" : "lax";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite,
  });

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Admin logged out successfully",
    data: null,
  });
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No refresh token provided");

  const result = await AuthServices.getNewAccessToken(refreshToken);
  setAuthCookies(res, result.tokens);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Access token refreshed successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  logout,

  refreshToken,
};
