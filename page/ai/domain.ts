import { Role } from "../../global-type/user";
import { AIServer } from "../../service/aiService";
import { CustomError } from "../../service/errorService";

export async function getAIChatStream(role: Role, message: string) {
  console.log("来了");
  if (role === "visitor") {
    throw new CustomError("暂未访问权限", "auth");
  }

  return AIServer.createTestStream(message);
}
