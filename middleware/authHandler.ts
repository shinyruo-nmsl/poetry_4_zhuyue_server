import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "../global-type/request";
import { CustomError } from "../service/errorService";

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");

  if (!token) {
    next(new CustomError("", "auth"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new CustomError("", "auth"));
  }
}
