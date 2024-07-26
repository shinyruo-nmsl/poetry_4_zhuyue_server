import { NextFunction, Response } from "express";
import { v1 } from "uuid";
import { Request } from "@/global-type/request";
import Logger from "@/service/logService";

export default function () {
  return (req: Request, res: Response, next: NextFunction) => {
    req.traceID = v1();
    Logger.traceMessage(`request start --${req.path}`, {
      level: "info",
      tags: {
        entryPoint: req.path,
        reqTraceID: req.traceID,
        userID: req.userId,
      },
      extra: {
        method: req.method,
        query: req.query,
        body: JSON.stringify(req.body),
        headers: req.headers,
      },
    });
    next();
  };
}
