import { Op } from "sequelize";

import getUserLoginModel from "../../model/userLogin";
import { CustomError } from "../../service/errorService";
import { Role } from "../../global-type/user";

export async function findUserByName(account: string) {
  try {
    const user = await getUserLoginModel().findOne({
      where: { account },
    });
    return user;
  } catch (error) {
    throw new CustomError(error.message, "database");
  }
}

export type UserRegistParam = {
  userId: string;
  account: string;
  password: string;
  role?: Role;
};

export async function addNewUser(params: UserRegistParam) {
  const { userId, account, password, role } = params;

  try {
    await getUserLoginModel().create({
      user_id: userId,
      account,
      password,
      role,
    });
  } catch (error) {
    throw new CustomError("用户名重复~", "validate");
  }
}
