import { asyncHandler } from "../../middleware/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setAuthCookies";
import { Request, Response } from "express";
import { UserServices } from "./user.service";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  let payload: any;
  if (req.body.data) {
    payload = JSON.parse(req.body.data);
  } else {
    payload = { ...req.body };
  }

  if (req.file) {
    payload.picture = (req.file as any).path;
  }

  const result = await UserServices.registerUser(payload);

  setAuthCookies(res, result.tokens);

  sendResponse(res, {
    success: true,
    successCode: 201,
    message: "User registered successfully",
    data: result.user,
  });
});
const getMe = asyncHandler(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;
    const user = await UserServices.getMe(userId);

    sendResponse(res, {
      success: true,
      successCode: 200,
      message: "Admin info retrieved successfully",
      data: user,
    });
  }
);

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;

  const updatedUser = await UserServices.updateUser(userId, payload);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "User updated successfully",
    data: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  await UserServices.deleteUser(userId);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "User deleted successfully",
    data: null,
  });
});

export const UserControllers = {
  registerUser,
  updateUser,
  deleteUser,
  getMe,
};
