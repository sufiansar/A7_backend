import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { ContactService } from "./contact.service";

const sendContact = asyncHandler(async (req: Request, res: Response) => {
  let payload: any;
  if (req.body.data) payload = JSON.parse(req.body.data);
  else payload = { ...req.body };

  const result = await ContactService.sendContact(payload);
  console.log(result);
  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Message sent successfully",
    data: result,
  });
});

export const ContactController = {
  sendContact,
};
