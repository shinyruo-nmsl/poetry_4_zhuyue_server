import getUserLoginModel from "../../model/userLogin";
import { CustomError } from "../../service/errorService";

export async function findUserByID(userId: string) {
  try {
    const user = await getUserLoginModel().findOne({
      where: { user_id: userId },
    });
    return user;
  } catch (error) {
    throw new CustomError(error.message, "database");
  }
}
