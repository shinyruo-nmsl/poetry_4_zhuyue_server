import { Response } from "express";
import { Request } from "../../global-type/request";
import type { UserRegistParam } from "./data-access";
import { validateUserLogin, registNewUser } from "./domain";
import { RouteConfig } from "../../service/middlewareService";
import { CustomError } from "../../service/errorService";

function validateUser(params: { userName: string; password: string }) {
  const { userName, password } = params;

  if (!userName) {
    throw new CustomError("用户名为空~", "validate");
  }

  if (userName.length > 20) {
    throw new CustomError("用户名太长~", "validate");
  }

  if (!password) {
    throw new CustomError("密码为空~", "validate");
  }

  if (password.length > 20) {
    throw new CustomError("密码太长~", "validate");
  }
}

type LoginReq = Request & { body: { account: string; password: string } };

const loginRoute: RouteConfig = {
  method: "post",
  path: "/login",
  middlewareConfig: {
    option: {},
    customValidate(req: LoginReq) {
      validateUser(req.body);
    },
    async customHandle(req: LoginReq, res: Response) {
      const { account, password } = req.body;

      const token = await validateUserLogin({ account, password });
      res.status(200).json({ token });
    },
  },
};

type RegistReq = Request & { body: UserRegistParam };

const registRoute: RouteConfig = {
  method: "post",
  path: "/regist",
  middlewareConfig: {
    option: {},
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

export default [loginRoute, registRoute];
