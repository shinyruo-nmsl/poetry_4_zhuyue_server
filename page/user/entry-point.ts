import { Response } from "express";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { getUserLoginInfoByToken } from "../../service/domain/user";

const getUserLoginInfoRouter: RouteConfig = {
  method: "get",
  path: "/getUserLoginInfo",
  middlewareConfig: {
    option: {},
    async customHandle(req: Request, res: Response) {
      const token = req.header("Authorization");

      const user = await getUserLoginInfoByToken(token);
      res.status(200).send(user).end();
    },
  },
};

export default [getUserLoginInfoRouter];
