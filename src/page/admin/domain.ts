import { queryUser, UserQuery } from "./data-access";

export async function searchUserLoginInfo(query: UserQuery) {
  const records = await queryUser(query);

  return {
    ...records,
    data: records.data.map(
      ({
        user_name: userName,
        user_id: userId,
        role,
        account,
        avatar,
        platform,
      }) => ({
        userName,
        userId,
        role,
        account,
        avatar,
        platform,
      })
    ),
  };
}
