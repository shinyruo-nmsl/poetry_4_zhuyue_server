import { Response } from "express";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { getUserLoginInfoByToken } from "../user/domain";
import { updateUserDisplayInfo, UserDisplayInfo } from "./data-access";

const getUserLoginInfoRouter: RouteConfig = {
  method: "get",
  path: "/getUserLoginInfo",
  middlewareConfig: {
    async customHandle(req: Request, res: Response) {
      res.setHeader("Cache-Control", "no-store");
      const token = req.header("Authorization");

      const user = await getUserLoginInfoByToken(token);
      res.status(200).send(user).end();
    },
  },
};

const updateUserDisplayInfoRouter: RouteConfig = {
  method: "post",
  path: "/updateUserDisplayInfo",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
    },
    async customHandle(
      req: Request<{ body: Omit<UserDisplayInfo, "userId"> }>,
      res: Response
    ) {
      await updateUserDisplayInfo({ userId: req.userId!, ...req.body });
      res.status(200).json({ msg: "修改成功" }).end();
    },
  },
};

export default [getUserLoginInfoRouter, updateUserDisplayInfoRouter];
