import UserLoginModel from "../../model/userLoginModel";
import { CustomError } from "../../service/errorService";

export async function findUserByID(userId: string) {
  try {
    const user = await UserLoginModel.model.findOne({
      where: { user_id: userId },
    });
    return user;
  } catch (error) {
    throw new CustomError(error.message, "database");
  }
}
