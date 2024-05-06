import { NextFunction, Request, Response } from "express";
import { CustomError } from "../service/errorService";

export default function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    switch (error.errorCode) {
      case "database":
      case "other":
        res
          .status(500)
          .json({ msg: error.message || "服务端错误~" })
          .end();
        break;
      case "validate":
        res.status(400).json({ msg: error.message }).end();
        break;
      case "auth":
        res.status(401).json({ msg: "登录失效~" }).end();
    }
  } else {
    res.status(500).json({ msg: "服务端错误~" }).end();
    throw error;
  }
}
