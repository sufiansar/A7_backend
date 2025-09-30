import prisma from "../../config/database";

const createSkill = async (userId: string, payload: any) => {
  const { iconUrl, ...rest } = payload; // extract icon URL if exists

  const skill = await prisma.skill.create({
    data: {
      ...rest,
      iconUrl,
      userId,
    },
  });

  return skill;
};

const getAllSkills = async () => {
  const skills = await prisma.skill.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return skills;
};

const getSkillById = async (id: string) => {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!skill) throw new Error("Skill not found");
  return skill;
};

const updateSkill = async (id: string, payload: any) => {
  const skill = await prisma.skill.update({ where: { id }, data: payload });
  return skill;
};

const deleteSkill = async (id: string) => {
  const skill = await prisma.skill.delete({ where: { id } });
  return skill;
};

export const SkillServices = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
