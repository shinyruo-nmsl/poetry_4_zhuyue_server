import { NextFunction, Response } from "express";
import { Request } from "../global-type/request";
import {
  getUserLoginInfoByToken,
  getUserLoginInfoById,
} from "../service/domain/user";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization");

  // 优化：如果用户登录校验成功了，就没必要解析token了
  try {
    if (req.userId) {
      const { role } = await getUserLoginInfoById(req.userId);
      req.role = role;
      next();
    } else {
      const { userId, role } = await getUserLoginInfoByToken(token);
      req.userId = userId;
      req.role = role;
      next();
    }
  } catch (err) {
    next(err);
  }
}
