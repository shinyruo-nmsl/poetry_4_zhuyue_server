import dayjs from "dayjs";

import { AIServer, AIChatMessage } from "@/service/aiService";
import RedisServer from "@/service/redisService";
import { Role } from "@/global-type/user";
import { CustomError } from "@/service/errorService";

import { USER_DALIY_PROMOT_COUNT } from "./config";

function getUserDaliyPromotCount(role: Exclude<Role, "visitor">) {
  return USER_DALIY_PROMOT_COUNT[role];
}

export async function getAIChatStream(
  role: Role,
  userID: string,
  messages: AIChatMessage[]
) {
  if (role === "visitor") {
    throw new CustomError("暂无访问权限", "auth");
  }

  const promptCount = getUserDaliyPromotCount(role);

  try {
    await RedisServer.limitCount(
      userID,
      promptCount,
      dayjs().endOf("day").toDate()
    );
  } catch (error) {
    throw new CustomError("今日使用次数已达上限~", "other", error);
  }

  return AIServer.createStream(messages);
}
