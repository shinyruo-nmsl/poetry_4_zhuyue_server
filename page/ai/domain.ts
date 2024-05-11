import { Role } from "../../global-type/user";
import { AIServer } from "../../service/aiService";
import { CustomError } from "../../service/errorService";

export async function getAIChatStream(role: Role, message: string) {
  if (role === "visitor") {
    throw new CustomError("暂无访问权限", "auth");
  }

  return AIServer.createTestStream(message);
}
