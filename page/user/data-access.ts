import UserLoginModel, {
  UserLoginModelFields,
} from "../../model/userLoginModel";
import { CustomError } from "../../service/errorService";
import Logger from "../../service/logService";
import RedisServer from "../../service/redisService";

export async function findUserByID(userId: string) {
  try {
    const cache = JSON.parse(
      await RedisServer.get(`__${userId}_usr_login_info__`)
    );
    if (cache) return cache as UserLoginModelFields;
  } catch (err) {
    Logger.traceError(err);
  }

  let user: UserLoginModelFields;
  try {
    user = await UserLoginModel.model.findOne({
      where: { user_id: userId },
    });
  } catch (error) {
    throw new CustomError(error.message, "database", error);
  }

  try {
    await RedisServer.set(
      `__${userId}_usr_login_info__`,
      JSON.stringify(user),
      {
        NX: true,
        EX: 60 * 60 * 24 * 7,
      }
    );
  } catch (err) {
    Logger.traceError(err);
  }

  return user;
}

export async function findUserByAccount(account: string) {
  try {
    const user = await UserLoginModel.model.findOne({
      where: { account },
    });
    return user;
  } catch (error) {
    throw new CustomError(error.message, "database", error);
  }
}

export type UserDisplayInfo = {
  userId: string;
  userName: string;
  avatar: string;
};

export async function updateUserDisplayInfo(info: UserDisplayInfo) {
  const t = await UserLoginModel.transcation();

  try {
    await UserLoginModel.model.update(
      { user_name: info.userName, avatar: info.avatar },
      { where: { user_id: info.userId }, transaction: t }
    );

    await RedisServer.del(`__${info.userId}_usr_login_info__`);
    await t.commit();
  } catch (error) {
    await t.rollback();
    Logger.traceError(error);
    throw new CustomError("修改失败~", "other", error);
  }
}
