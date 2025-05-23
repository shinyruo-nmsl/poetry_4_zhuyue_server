export type Role = "admin" | "superMember" | "member" | "ordinary" | "visitor";
export type Platform = "pc" | "mini";

export type UserLoginInfo = {
  userId: string;
  account: string;
  role: Role;
  userName?: string;
  avatar?: string;
};
