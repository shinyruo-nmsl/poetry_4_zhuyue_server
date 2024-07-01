import { Role } from "@/global-type/user";

export const USER_DALIY_PROMOT_COUNT: Record<
  Exclude<Role, "visitor">,
  number
> = {
  admin: Infinity,
  superMember: Infinity,
  member: 30,
  ordinary: 3,
};
