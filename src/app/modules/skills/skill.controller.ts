import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { SkillServices } from "./skill.service";
import { sendResponse } from "../../utils/sendResponse";

const createSkill = asyncHandler(async (req: Request, res: Response) => {
  let payload: any;
  if (req.body.data) {
    payload = JSON.parse(req.body.data);
  } else {
    payload = { ...req.body };
  }

  if (req.file) {
    payload.iconUrl = (req.file as any).path;
  }
  const userId = (req as any).user.id;
  const skill = await SkillServices.createSkill(userId, payload);

  sendResponse(res, {
    success: true,
    successCode: 201,
    message: "Skill created successfully",
    data: skill,
  });
});

const getAllSkills = asyncHandler(async (req: Request, res: Response) => {
  const skills = await SkillServices.getAllSkills();

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Skills fetched successfully",
    data: skills,
  });
});

const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const skillId = req.params.id;

  let payload: any;
  if (req.body.data) {
    payload = JSON.parse(req.body.data);
  } else {
    payload = { ...req.body };
  }

  if (req.file) {
    payload.iconUrl = (req.file as any).path;
  }

  const skill = await SkillServices.updateSkill(skillId, payload);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Skill updated successfully",
    data: skill,
  });
});

const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  const skillId = req.params.id;

  const skill = await SkillServices.deleteSkill(skillId);

  sendResponse(res, {
    success: true,
    successCode: 200,
    message: "Skill deleted successfully",
    data: skill,
  });
});
export const SkillController = {
  createSkill,
  getAllSkills,
  updateSkill,
  deleteSkill,
};
