import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { CustomError } from "../../service/errorService";
import { findUserByName, addNewUser } from "./data-access";
import type { UserRegistParam } from "./data-access";

export async function validateUserLogin(params: {
  userName: string;
  password: string;
}) {
  const { userName, password } = params;

  const user = await findUserByName(userName);

  if (!user) {
    throw new CustomError("暂无此用户~", "validate");
  }

  const passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new CustomError("密码错误~", "validate");
  }

  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
}

export async function registNewUser(params: Omit<UserRegistParam, "userId">) {
  const { userName, password, role } = params;

  const userId = v4();
  let hashPassword: string;
  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    throw new CustomError(error.message, "other");
  }

  if (hashPassword) {
    await addNewUser({ userId, userName, password: hashPassword, role });
  }
}
