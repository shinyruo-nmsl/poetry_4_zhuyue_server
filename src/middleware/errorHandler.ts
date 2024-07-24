import { NextFunction, Response } from "express";
import { Request } from "@/global-type/request";
import { CustomError } from "@/service/errorService";
import Logger from "@/service/logService";

export default function () {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    const rawError =
      error instanceof CustomError && error.error ? error.error : error;
    Logger.traceError(rawError, {
      level: "error",
      tags: {
        entryPoint: req.path,
      },
      extra: {
        traceID: req.traceID,
        method: req.method,
        query: req.query,
        body: JSON.stringify(req.body),
      },
    });
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
          res
            .status(400)
            .json({ msg: error.message || "参数错误~" })
            .end();
          break;
        case "login":
          res.status(401).json({ msg: "登录失效~" }).end();
          break;
        case "auth":
          res.status(403).json({ msg: "暂无权限~" }).end();
          break;
        case "overtime":
          res
            .status(408)
            .json({ msg: error.message || "连接超时~" })
            .end();
      }
    } else {
      res.status(500).json({ msg: "服务端错误~" }).end();
      throw error;
    }
  };
}
