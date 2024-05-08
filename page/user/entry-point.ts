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
    option: {},
    async customHandle(req: Request, res: Response) {
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
      auth: true,
    },
    async customHandle(req: UpdateUserAvatarReq, res: Response) {
      await updateUserAvatar(req.userId!, req.body.avatar);
      res.status(200).end();
    },
  },
};

type UpdateUserNameReq = Request & { body: { userName: string } };

const updateUserNameRouter: RouteConfig = {
  method: "post",
  path: "/updateUserName",
  middlewareConfig: {
    option: {
      auth: true,
    },
    async customHandle(req: UpdateUserNameReq, res: Response) {
      await updateUserName(req.userId!, req.body.userName);
      res.status(200).end();
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
      auth: true,
    },
    async customHandle(req: UpdateUserDisplayInfoReq, res: Response) {
      await updateUserDisplayInfo({ userId: req.userId!, ...req.body });
      res.status(200).end();
    },
  },
};

export default [
  getUserLoginInfoRouter,
  updateUserAvatarRouter,
  updateUserNameRouter,
  updateUserDisplayInfoRouter,
];
