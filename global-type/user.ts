export type Role = "admin" | "member" | "ordinary" | "visitor";

export type UserLoginInfo = {
  userId: string;
  account: string;
  role: Role;
  userName?: string;
  avatar?: string;
};
