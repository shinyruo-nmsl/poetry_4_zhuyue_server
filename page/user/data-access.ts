import getUserLoginModel from "../../model/userLogin";
import { CustomError } from "../../service/errorService";

export async function updateUserAvatar(userId: string, avatar: string) {
  try {
    await getUserLoginModel().update(
      { avatar },
      { where: { user_id: userId } }
    );
  } catch {
    throw new CustomError("更新失败~", "other");
  }
}

export async function updateUserName(userId: string, userName: string) {
  try {
    await getUserLoginModel().update(
      { user_name: userName },
      { where: { user_id: userId } }
    );
  } catch {
    throw new CustomError("修改失败~", "other");
  }
}

export type UserDisplayInfo = {
  userId: string;
  useName: string;
  avatar: string;
};

export async function updateUserDisplayInfo(info: UserDisplayInfo) {
  try {
    await getUserLoginModel().update(
      { user_name: info.useName, avatar: info.avatar },
      { where: { user_id: info.userId } }
    );
  } catch {
    throw new CustomError("修改失败~", "other");
  }
}
