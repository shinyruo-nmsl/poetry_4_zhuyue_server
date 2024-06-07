import { NextFunction, Response } from "express";
import { Request } from "@/global-type/request";

export default function (need: true) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    next();
  };
}
