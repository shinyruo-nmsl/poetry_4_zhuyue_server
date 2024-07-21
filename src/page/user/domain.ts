import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByAccount, findUserByID } from "./data-access";
import { Role } from "@/global-type/user";

export async function getUserLoginInfoById(_userId: string) {
  if (!_userId) return { role: "visitor" as Role };

  const user = await findUserByID(_userId);
  if (!user) {
    return { role: "visitor" as Role };
  }

  const {
    user_name: userName,
    user_id: userId,
    role,
    account,
    avatar,
    platform,
  } = user;

  return { userName, userId, role, account, avatar, platform };
}

export async function getUserLoginInfoByAccount(_account: string) {
  if (!_account) return { role: "visitor" as Role };

  const user = await findUserByAccount(_account);
  if (!user) {
    return { role: "visitor" as Role };
  }

  const {
    user_name: userName,
    user_id: userId,
    role,
    account,
    avatar,
    platform,
  } = user;

  return { userName, userId, role, account, avatar, platform };
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
