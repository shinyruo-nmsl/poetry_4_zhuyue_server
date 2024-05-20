import UserLoginModel from "../../model/userLoginModel";
import { CustomError } from "../../service/errorService";

export async function findUserByID(userId: string) {
  try {
    const user = await UserLoginModel.model.findOne({
      where: { user_id: userId },
    });
    return user;
  } catch (error) {
    throw new CustomError(error.message, "database", error);
  }
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

export async function updateUserAvatar(userId: string, avatar: string) {
  try {
    await UserLoginModel.model.update(
      { avatar },
      { where: { user_id: userId } }
    );
  } catch (error) {
    throw new CustomError("更新失败~", "other", error);
  }
}

export async function updateUserName(userId: string, userName: string) {
  try {
    await UserLoginModel.model.update(
      { user_name: userName },
      { where: { user_id: userId } }
    );
  } catch (error) {
    throw new CustomError("修改失败~", "other", error);
  }
}

export type UserDisplayInfo = {
  userId: string;
  userName: string;
  avatar: string;
};

export async function updateUserDisplayInfo(info: UserDisplayInfo) {
  try {
    await UserLoginModel.model.update(
      { user_name: info.userName, avatar: info.avatar },
      { where: { user_id: info.userId } }
    );
  } catch (error) {
    throw new CustomError("修改失败~", "other", error);
  }
}
