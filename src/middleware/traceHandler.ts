import { NextFunction, Response } from "express";
import { v1 } from "uuid";
import { Request } from "@/global-type/request";
import Logger from "@/service/logService";

export default function () {
  return (req: Request, res: Response, next: NextFunction) => {
    req.traceID = v1();
    Logger.traceEvent({
      event_id: req.traceID,
      request: req as any,
    });
    next();
  };
}
