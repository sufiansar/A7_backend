import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, tokens: AuthTokens) => {
  const isProd = process.env.NODE_ENV === "production";

  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      expires: new Date(
        Date.now() +
          (parseInt(process.env.JWT_COOKIE_EXPIRE!) || 7) * 24 * 60 * 60 * 1000
      ),
    });
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      expires: new Date(
        Date.now() +
          (parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRE!) || 30) *
            24 *
            60 *
            60 *
            1000
      ),
    });
  }
};
