import { NextFunction, Response } from "express";
import { Request } from "../global-type/request";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../global-type/user";
import { CustomError } from "../service/errorService";
import { UserPermission, getUserLoginInfoById } from "../service/domain/user";

export default function ({ role }: { role: Exclude<Role, "visitor"> }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");

    if (!token) {
      next(new CustomError("登录失败", "login"));
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as JwtPayload;
      req.userId = decoded.userId;
    } catch (error) {
      next(new CustomError("登录失败", "login"));
      return;
    }

    // 优化：如果只是需要普通用户权限，没必要再去查询了
    if (role === "ordinary") {
      req.role = "ordinary";
      next();
      return;
    }

    try {
      const { role: _role } = await getUserLoginInfoById(req.userId);
      if (UserPermission.hasPermission(role, _role)) {
        req.role = _role;
        next();
      } else {
        throw new CustomError("暂无访问权限", "auth");
      }
    } catch (err) {
      next(err);
    }
  };
}
