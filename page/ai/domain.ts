import RedisServer from "../../service/redisService";
import { Role } from "../../global-type/user";
import { AIServer } from "../../service/domain/ai";
import { CustomError } from "../../service/errorService";

export async function getAIChatStream(
  role: Role,
  userID: string,
  message: string
) {
  if (role === "visitor") {
    throw new CustomError("暂无访问权限", "auth");
  }

  if (role === "ordinary") {
    if (!RedisServer.get(userID)) {
      RedisServer.set(userID, 1);
    }
  }

  return AIServer.createStream(message);
}
