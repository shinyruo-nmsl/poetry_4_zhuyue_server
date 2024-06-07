import { Response } from "express";
import { Request } from "@/global-type/request";
import { RouteConfig } from "@/service/middlewareService";
import { CustomError } from "@/service/errorService";
import type { UserRegistParam } from "./data-access";
import {
  validateUserLogin,
  registNewUser,
  validateMiniUserLogin,
} from "./domain";

function validateUser(params: { account: string; password: string }) {
  const { account, password } = params;

  if (!account) {
    throw new CustomError("账号为空~", "validate");
  }

  if (account.length > 20) {
    throw new CustomError("账号太长~", "validate");
  }

  if (!password) {
    throw new CustomError("密码为空~", "validate");
  }

  if (password.length > 20) {
    throw new CustomError("密码太长~", "validate");
  }
}

type LoginReq = Request<{ body: { account: string; password: string } }>;

const loginRoute: RouteConfig = {
  method: "post",
  path: "/login",
  middlewareConfig: {
    customValidate(req: LoginReq) {
      validateUser(req.body);
    },
    async customHandle(req: LoginReq, res: Response) {
      const { account, password } = req.body;

      const token = await validateUserLogin({ account, password });
      res.status(200).json({ token }).end();
    },
  },
};

const miniLoginRoute: RouteConfig = {
  method: "post",
  path: "/miniLogin",
  middlewareConfig: {
    async customHandle(
      req: Request<{ body: { code: string } }>,
      res: Response
    ) {
      const { code } = req.body;

      const token = await validateMiniUserLogin({ code });
      res.status(200).json({ token }).end();
    },
  },
};

type RegistReq = Request<{ body: UserRegistParam }>;

const registRoute: RouteConfig = {
  method: "post",
  path: "/regist",
  middlewareConfig: {
    customValidate(req: RegistReq) {
      validateUser(req.body);
    },
    async customHandle(req: RegistReq, res: Response) {
      const { account, password, role } = req.body;

      await registNewUser({ account, password, role });
      res.status(200).json({ msg: "注册成功~" }).end();
    },
  },
};

export default [loginRoute, miniLoginRoute, registRoute];
