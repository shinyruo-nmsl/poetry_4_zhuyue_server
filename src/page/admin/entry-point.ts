import { RouteConfig } from "@/service/middlewareService";
import { Request } from "@/global-type/request";
import { Role } from "@/global-type/user";
import { deleteUser, updateUserRole, UserQuery } from "./data-access";
import { searchUserLoginInfo } from "./domain";

const searchUserLoginInfoRoute: RouteConfig = {
  method: "get",
  path: "/searchUserLoginInfo",
  middlewareConfig: {
    option: {
      auth: { role: "admin" },
    },
    async customHandle(req: Request<{ query: UserQuery }>, res) {
      const userInfo = await searchUserLoginInfo({
        ...req.query,
        limit: Number(req.query.limit),
        pageNo: Number(req.query.pageNo),
      });
      res.send(userInfo).end();
    },
  },
};

const updateUserRoleRoute: RouteConfig = {
  method: "post",
  path: "/updateUserRole",
  middlewareConfig: {
    option: {
      auth: { role: "admin" },
    },
    async customHandle(
      req: Request<{ body: { userId: string; role: Role } }>,
      res
    ) {
      const { userId, role } = req.body;
      await updateUserRole(userId, role);
      res.send({ msg: "修改成功~" }).end();
    },
  },
};

const removeUserRoute: RouteConfig = {
  method: "delete",
  path: "/removeUser",
  middlewareConfig: {
    option: {
      auth: { role: "admin" },
    },
    async customHandle(req: Request<{ body: { userId: string } }>, res) {
      const { userId } = req.body;
      await deleteUser(userId);
      res.send({ msg: "删除成功~" }).end();
    },
  },
};

export default [searchUserLoginInfoRoute, updateUserRoleRoute, removeUserRoute];
