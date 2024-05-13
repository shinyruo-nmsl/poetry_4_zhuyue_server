import { Response } from "express";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { getUserLoginInfoByToken } from "../../service/domain/user";
import {
  updateUserAvatar,
  updateUserName,
  updateUserDisplayInfo,
  UserDisplayInfo,
} from "./data-access";

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

type UpdateUserAvatarReq = Request & { body: { avatar: string } };

const updateUserAvatarRouter: RouteConfig = {
  method: "post",
  path: "/updateUserAvatar",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
    },
    async customHandle(req: UpdateUserAvatarReq, res: Response) {
      await updateUserAvatar(req.userId!, req.body.avatar);
      res.status(200).json({ msg: "修改成功" }).end();
    },
  },
};

type UpdateUserNameReq = Request & { body: { userName: string } };

const updateUserNameRouter: RouteConfig = {
  method: "post",
  path: "/updateUserName",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
    },
    async customHandle(req: UpdateUserNameReq, res: Response) {
      await updateUserName(req.userId!, req.body.userName);
      res.status(200).json({ msg: "修改成功" }).end();
    },
  },
};

type UpdateUserDisplayInfoReq = Request & {
  body: Omit<UserDisplayInfo, "userId">;
};

const updateUserDisplayInfoRouter: RouteConfig = {
  method: "post",
  path: "/updateUserDisplayInfo",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
    },
    async customHandle(req: UpdateUserDisplayInfoReq, res: Response) {
      await updateUserDisplayInfo({ userId: req.userId!, ...req.body });
      res.status(200).json({ msg: "修改成功" }).end();
    },
  },
};

export default [
  getUserLoginInfoRouter,
  updateUserAvatarRouter,
  updateUserNameRouter,
  updateUserDisplayInfoRouter,
];
