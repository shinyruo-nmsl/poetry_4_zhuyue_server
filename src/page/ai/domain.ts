import dayjs from "dayjs";

import {
  AIServer,
  AIChatMessage,
  AIImagePrompt,
  AIParseImageMessage,
} from "@/service/aiService";
import RedisServer from "@/service/redisService";
import { Role } from "@/global-type/user";
import { CustomError } from "@/service/errorService";

import { USER_DALIY_PROMOT_COUNT, AICategory } from "./config";

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

export async function getAIParseImageStream(
  role: Role,
  userID: string,
  message: AIParseImageMessage
) {
  await validateUserDaliyPromotCount("parseImage", role, userID);

  return AIServer.createParseImageStream(message);
}

function getUserDaliyPromotCount(
  category: AICategory,
  role: Exclude<Role, "visitor">
) {
  return USER_DALIY_PROMOT_COUNT[category][role];
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

  const { status } = await RedisServer.limitCount(
    category + "__" + userID,
    promptCount,
    dayjs().endOf("day").toDate()
  );

  if (status === "reject") {
    throw new CustomError("今日请求次数已用完", "auth");
  }
}
