import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByID } from "../data-access/user";
import { Role } from "../../global-type/user";

export async function getUserLoginInfoById(_userId: string) {
  if (!_userId) return { role: "visitor" as Role };

  const user = await findUserByID(_userId);
  if (!user) {
    return { role: "visitor" as Role };
  }

  const { user_name: userName, user_id: userId, role, account, avatar } = user;

  return { userName, userId, role, account, avatar };
}

export async function getUserLoginInfoByToken(token?: string) {
  let userId: string;
  if (!token) {
    userId = "";
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    userId = "";
  }

  return getUserLoginInfoById(userId);
}
