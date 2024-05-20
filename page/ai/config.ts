import { Role } from "../../global-type/user";

export const USER_DALIY_PROMOT_COUNT: Record<
  Exclude<Role, "visitor">,
  number
> = {
  admin: Infinity,
  ordinary: 4,
};
