import { Role } from "@/global-type/user";

export type AICategory = "chat" | "image";

export const USER_DALIY_PROMOT_COUNT: Record<
  AICategory,
  Record<Exclude<Role, "visitor">, number>
> = {
  chat: {
    admin: Infinity,
    superMember: Infinity,
    member: 30,
    ordinary: 3,
  },
  image: {
    admin: Infinity,
    superMember: 30,
    member: 10,
    ordinary: 1,
  },
};
