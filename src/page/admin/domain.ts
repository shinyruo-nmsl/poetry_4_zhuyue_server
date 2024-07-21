import { Pagination, PaginationQuery } from "@/global-type/model";
import { UserLoginModelFields } from "@/model/userLoginModel";

import {
  queryUsersByAccount,
  queryUsersById,
  queryUsersByName,
  queryUserByRole,
  queryUserByPlatform,
} from "./data-access";
import { Platform, Role } from "@/global-type/user";

export interface UsersQuery<
  T = "userId" | "userName" | "account" | "role" | "platform"
> extends PaginationQuery {
  type: T;
  value: T extends "role" ? Role : string;
}

export async function searchUserLoginInfo(query: UsersQuery) {
  const { type, value } = query;

  let records: Pagination<UserLoginModelFields>;

  switch (type) {
    case "userId":
      records = await queryUsersById({ ...query, userId: value });
      break;
    case "account":
      records = await queryUsersByAccount({ ...query, account: value });
      break;
    case "userName":
      records = await queryUsersByName({ ...query, userName: value });
      break;
    case "role":
      records = await queryUserByRole({ ...query, role: value as Role });
      break;
    case "platform":
      records = await queryUserByPlatform({
        ...query,
        platform: value as Platform,
      });
      break;
  }

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
