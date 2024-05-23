import { NextFunction, Response } from "express";
import { v1 } from "uuid";
import { Request } from "../global-type/request";

export default function () {
  return (req: Request, res: Response, next: NextFunction) => {
    req.traceID = v1();
    next();
  };
}
