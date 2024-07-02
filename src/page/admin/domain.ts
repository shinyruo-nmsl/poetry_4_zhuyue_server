import { Pagination, PaginationQuery } from "@/global-type/model";
import { UserLoginModelFields } from "@/model/userLoginModel";

import {
  queryUsersByAccount,
  queryUsersById,
  queryUsersByName,
  queryUserByRole,
} from "./data-access";
import { Role } from "@/global-type/user";

export interface UsersQuery<T = "userId" | "userName" | "account" | "role">
  extends PaginationQuery {
  type: T;
  value: T extends "role" ? Role : string;
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
    case "role":
      records = await queryUserByRole({ ...query, role: value as Role });
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
