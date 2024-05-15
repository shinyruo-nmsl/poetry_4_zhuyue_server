import { NextFunction, Request, Response } from "express";
import { CustomError } from "../service/errorService";

export default function (option: { timeout: number } = { timeout: 5000 }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { timeout } = option;

    const requestTimer = setTimeout(() => {
      next(new CustomError("请求超时", "overtime"));
    }, timeout);

    req.on("close", () => {
      clearTimeout(requestTimer);
    });

    next();
  };
}
