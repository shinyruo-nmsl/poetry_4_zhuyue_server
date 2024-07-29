import { Op } from "sequelize";

import { PaginationQuery } from "@/global-type/model";
import { Platform, Role } from "@/global-type/user";
import UserLoginModel from "@/model/userLoginModel";
import { CustomError } from "@/service/errorService";
import { queryPaginationRecords } from "@/service/modelService";
import RedisServer from "@/service/redisService";

export interface UserQuery extends PaginationQuery {
  searchTerm?: string;
  role?: Role;
  platform?: Platform;
}

export async function queryUser(query: UserQuery) {
  const { limit, pageNo, role, platform, searchTerm } = query;

  const whereConditions = [];

  if (role) {
    whereConditions.push({ role });
  }

  if (platform) {
    whereConditions.push({ platform });
  }

  if (searchTerm) {
    whereConditions.push({
      [Op.or]: [
        { account: { [Op.like]: `${searchTerm}%` } },
        { user_name: { [Op.like]: `${searchTerm}%` } },
        { user_id: { [Op.like]: `${searchTerm}%` } },
      ],
    });
  }

  const where = { [Op.and]: whereConditions };

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
    throw new CustomError("删除失败", "database", error);
  }
}
