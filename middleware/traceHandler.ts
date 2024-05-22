import { NextFunction, Response } from "express";
import uuid from "uuid";
import { Request } from "../global-type/request";

export default function () {
  return (req: Request, res: Response, next: NextFunction) => {
    req.traceID = uuid.v1();
    next();
  };
}
