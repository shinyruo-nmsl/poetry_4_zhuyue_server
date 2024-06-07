import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "@/global-type/request";
import { Role } from "@/global-type/user";
import { CustomError } from "@/service/errorService";
import { UserPermission } from "@/service/permissionService";
import { getUserLoginInfoById } from "@/page/user/domain";

export default function ({
  role,
  accurate = false,
}: {
  role: Exclude<Role, "visitor">;
  accurate?: boolean;
}) {
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
    if (role === "ordinary" && !accurate) {
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
        next(new CustomError("暂无访问权限", "auth"));
      }
    } catch (err) {
      next(err);
    }
  };
}
