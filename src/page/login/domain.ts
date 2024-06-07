import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import axios from "axios";
import { CustomError } from "@/service/errorService";
import { findUserByName, addNewUser } from "./data-access";
import type { UserRegistParam } from "./data-access";
import Logger from "@/service/logService";

export async function validateUserLogin(params: {
  account: string;
  password: string;
}) {
  const { account, password } = params;

  const user = await findUserByName(account);

  if (!user) {
    throw new CustomError("暂无此用户~", "validate");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new CustomError("密码错误~", "validate");
  }

  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
}

async function getWXLoginInfo({ code }: { code: string }) {
  try {
    const res = await axios.get<
      any,
      {
        data: {
          session_key?: string;
          openid?: string;
          errcode: number;
          errmsg: string;
        };
      }
    >("https://api.weixin.qq.com/sns/jscode2session", {
      params: {
        js_code: code,
        appid: process.env.WX_APP_ID,
        secret: process.env.WX_APP_SECRET,
        grant_type: "authorization_code",
      },
    });

    console.log(res.data);

    if (!res.data.openid) {
      Logger.traceError(res);
      throw new Error(JSON.stringify(res));
    }
    return res.data;
  } catch (err) {
    throw new CustomError("登录校验失败~", "login", err);
  }
}

export async function validateMiniUserLogin({ code }: { code: string }) {
  const { openid } = await getWXLoginInfo({ code });

  const user = await findUserByName(openid);
  let userId: string;
  if (!user) {
    userId = v4();
    await addNewUser({
      userId,
      account: openid,
      password: "",
      role: "ordinary",
    });
  } else {
    userId = user.user_id;
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
}

export async function registNewUser(params: Omit<UserRegistParam, "userId">) {
  const { account, password, role } = params;

  const userId = v4();
  let hashPassword: string;
  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    throw new CustomError(error.message, "other", error);
  }

  if (hashPassword) {
    await addNewUser({ userId, account, password: hashPassword, role });
  }
}
