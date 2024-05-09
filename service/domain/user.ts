import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByID } from "../data-access/user";
import { Role } from "../../global-type/user";

export async function getUserLoginInfoById(_userId: string) {
  if (!_userId) return { role: "visitor" as Role };

  const user = await findUserByID(_userId);
  if (!user) {
    return { role: "visitor" as Role };
  }

  const { user_name: userName, user_id: userId, role, account } = user;

  return { userName, userId, role, account };
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

export class UserPermission {
  private static roles: Role[] = ["visitor", "ordinary", "admin"];

  static hasPermission(auth: Role, user: Role) {
    const userIndex = this.roles.findIndex((r) => r === user);
    if (userIndex < 0) return false;

    const authIndex = this.roles.findIndex((r) => r === auth);

    return userIndex >= authIndex;
  }
}
