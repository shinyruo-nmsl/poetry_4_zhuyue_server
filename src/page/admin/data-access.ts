import { Op } from "sequelize";

import { PaginationQuery } from "@/global-type/model";
import { Role } from "@/global-type/user";
import UserLoginModel from "@/model/userLoginModel";
import { CustomError } from "@/service/errorService";
import { queryPaginationRecords } from "@/service/modelService";
import RedisServer from "@/service/redisService";
import Logger from "@/service/logService";

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

export async function queryUserByRole(query: PaginationQuery & { role: Role }) {
  const { limit, pageNo, role } = query;

  const where = role ? { role } : {};

  return queryPaginationRecords(UserLoginModel.model, where, limit, pageNo);
}

export async function updateUserRole(userId: string, role: Role) {
  const t = await UserLoginModel.transcation();

  try {
    await UserLoginModel.model.update(
      { role },
      { where: { user_id: userId }, transaction: t }
    );
    await RedisServer.del(`__${userId}_usr_login_info__`);
    await t.commit();
  } catch (error) {
    await t.rollback();
    Logger.traceError(error);
    throw new CustomError("更新失败", "database", error);
  }
}

export async function deleteUser(userId: string) {
  const t = await UserLoginModel.transcation();

  try {
    await UserLoginModel.model.destroy({
      where: { user_id: userId },
      transaction: t,
    });
    await RedisServer.del(`__${userId}_usr_login_info__`);
    await t.commit();
  } catch (error) {
    await t.rollback();
    Logger.traceError(error);
    throw new CustomError("删除失败", "database", error);
  }
}
