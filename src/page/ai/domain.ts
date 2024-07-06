import dayjs from "dayjs";

import { AIServer, AIChatMessage, AIImagePrompt } from "@/service/aiService";
import RedisServer from "@/service/redisService";
import { Role } from "@/global-type/user";
import { CustomError } from "@/service/errorService";

import { USER_DALIY_PROMOT_COUNT, AICategory } from "./config";

function getUserDaliyPromotCount(
  category: AICategory,
  role: Exclude<Role, "visitor">
) {
  return USER_DALIY_PROMOT_COUNT[category][role];
}

export async function getAIChatStream(
  role: Role,
  userID: string,
  messages: AIChatMessage[]
) {
  await validateUserDaliyPromotCount("chat", role, userID);

  return AIServer.createGPTStream(messages);
}

export async function getAIImages(
  role: Role,
  userID: string,
  prompt: AIImagePrompt
) {
  await validateUserDaliyPromotCount("image", role, userID);

  return AIServer.createImages(prompt);
}

async function validateUserDaliyPromotCount(
  category: AICategory,
  role: Role,
  userID: string
) {
  if (role === "visitor") {
    throw new CustomError("暂无访问权限", "auth");
  }

  const promptCount = getUserDaliyPromotCount(category, role);

  try {
    await RedisServer.limitCount(
      category + "__" + userID,
      promptCount,
      dayjs().endOf("day").toDate()
    );
  } catch (error) {
    throw new CustomError("今日使用次数已达上限~", "other", error);
  }
}
