import { NextFunction, Request, Response } from "express";
import { CustomError } from "../service/errorHandler";

export default function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    switch (error.errorCode) {
      case "database":
        res.status(500).json({ msg: "服务端错误~" }).end();
        break;
      case "validate":
        res.status(400).json({ msg: error.message }).end();
    }
  } else {
    throw error;
  }
}
