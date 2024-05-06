import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { findUserByID } from "./data-access";

const getUserLoginInfoRouter: RouteConfig = {
  method: "get",
  path: "/getUserLoginInfo",
  middlewareConfig: {
    option: {},
    async customHandle(req: Request, res: Response) {
      const token = req.header("Authorization");

      if (!token) {
        res.status(200).send({ role: "visitor" }).end();
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as JwtPayload;

      const {
        user_name: userName,
        user_id: userId,
        role,
      } = await findUserByID(decoded.userId);

      res.status(200).send({ userName, userId, role }).end();
    },
  },
};

export default [getUserLoginInfoRouter];
