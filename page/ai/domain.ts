import dayjs from "dayjs";

import { AIServer } from "../../service/aiService";
import RedisServer from "../../service/redisService";
import { Role } from "../../global-type/user";
import { CustomError } from "../../service/errorService";

import { USER_DALIY_PROMOT_COUNT } from "./config";

function getUserDaliyPromotCount(role: Exclude<Role, "visitor">) {
  return USER_DALIY_PROMOT_COUNT[role];
}

export async function getAIChatStream(
  role: Role,
  userID: string,
  message: string
) {
  if (role === "visitor") {
    throw new CustomError("暂无访问权限", "auth");
  }

  const promptCount = getUserDaliyPromotCount(role);

  const { status } = await RedisServer.limitCount(
    userID,
    promptCount,
    dayjs().endOf("day").toDate()
  );
  if (status === "reject") {
    throw new CustomError("今日使用次数已达上限~", "other");
  }

  return AIServer.createStream(message);
}
