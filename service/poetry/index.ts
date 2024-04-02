import { Request, Response } from "express";

import { RouteConfig, RouterConfig } from "../../util/middlewareHandler";

const getPoetry: RouteConfig = {
  method: "get",
  path: "/",
  middlewareConfig: {
    option: {
      zz: [1],
    },
    customHandle(req: Request & { id: string }, res, next) {
      console.log("有请求进来了");
      res.end();
    },
  },
};

const poetry: RouterConfig = {
  path: "/poetry",
  routes: [getPoetry],
};

export default poetry;
