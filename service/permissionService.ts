import { Role } from "../global-type/user";

export class UserPermission {
  private static roles: Role[] = ["visitor", "member", "ordinary", "admin"];

  static hasPermission(auth: Role, user: Role) {
    const userIndex = this.roles.findIndex((r) => r === user);
    if (userIndex < 0) return false;

    const authIndex = this.roles.findIndex((r) => r === auth);

    return userIndex >= authIndex;
  }
}
