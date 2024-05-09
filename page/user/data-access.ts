import UserLoginModel from "../../model/userLoginModel";
import { CustomError } from "../../service/errorService";

export async function updateUserAvatar(userId: string, avatar: string) {
  try {
    await UserLoginModel.model.update(
      { avatar },
      { where: { user_id: userId } }
    );
  } catch {
    throw new CustomError("更新失败~", "other");
  }
}

export async function updateUserName(userId: string, userName: string) {
  try {
    await UserLoginModel.model.update(
      { user_name: userName },
      { where: { user_id: userId } }
    );
  } catch {
    throw new CustomError("修改失败~", "other");
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
  } catch {
    throw new CustomError("修改失败~", "other");
  }
}
