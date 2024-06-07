import { Op } from "sequelize";

import { PaginationQuery } from "@/global-type/model";
import { Role } from "@/global-type/user";
import UserLoginModel from "@/model/userLoginModel";
import { CustomError } from "@/service/errorService";
import { queryPaginationRecords } from "@/service/modelService";

export async function queryUsersByAccount(
  query: PaginationQuery & { account: string }
) {
  const { limit, pageNo, account } = query;

  const where = account ? { account: { [Op.like]: `%${account}%` } } : {};

  return queryPaginationRecords(UserLoginModel.model, where, limit, pageNo);
}

export async function queryUsersById(
  query: PaginationQuery & { userId: string }
) {
  const { limit, pageNo, userId } = query;

  const where = userId ? { user_id: { [Op.like]: `%${userId}%` } } : {};

  return queryPaginationRecords(UserLoginModel.model, where, limit, pageNo);
}

export async function queryUsersByName(
  query: PaginationQuery & { userName: string }
) {
  const { limit, pageNo, userName } = query;

  const where = userName ? { user_name: { [Op.like]: `%${userName}%` } } : {};

  return queryPaginationRecords(UserLoginModel.model, where, limit, pageNo);
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    await UserLoginModel.model.update({ role }, { where: { user_id: userId } });
  } catch (error) {
    throw new CustomError("更新失败", "database", error);
  }
}

export async function deleteUser(userId: string) {
  try {
    await UserLoginModel.model.destroy({ where: { user_id: userId } });
  } catch (error) {
    throw new CustomError("删除失败", "database", error);
  }
}
