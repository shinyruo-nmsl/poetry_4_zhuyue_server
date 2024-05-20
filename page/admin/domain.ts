import { Pagination, PaginationQuery } from "../../global-type/model";
import { UserLoginModelFields } from "../../model/userLoginModel";

import {
  queryUsersByAccount,
  queryUsersById,
  queryUsersByName,
} from "./data-access";

export interface UsersQuery extends PaginationQuery {
  type: "userId" | "userName" | "account";
  value: string;
}

export async function searchUserLoginInfo(query: UsersQuery) {
  const { type, value } = query;
  let records: Pagination<UserLoginModelFields>;
  switch (type) {
    case "userId":
      records = await queryUsersById({ ...query, userId: value });
    case "account":
      records = await queryUsersByAccount({ ...query, account: value });

    case "userName":
      records = await queryUsersByName({ ...query, userName: value });
  }

  return {
    ...records,
    data: records.data.map(
      ({ user_name: userName, user_id: userId, role, account, avatar }) => ({
        userName,
        userId,
        role,
        account,
        avatar,
      })
    ),
  };
}
