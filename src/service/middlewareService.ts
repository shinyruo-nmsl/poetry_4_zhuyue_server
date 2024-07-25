import express, { Express, Router, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import { Request } from "../global-type/request";
import MiddleWare, { MiddlewaresConfig } from "../middleware";
import { HttpMethod } from "../global-type/request";

export type RouteConfig = {
  method: HttpMethod;
  path: `/${string}`;
  middlewareConfig: {
    option?: MiddlewaresConfig;
    customValidate?: (req: Request, res: Response, next: NextFunction) => void;
    customHandle(req: Request, res: Response, next: NextFunction): void;
  };
};

export type RouterConfig = {
  path: `/${string}`;
  routes: RouteConfig[];
};

export default function handleMiddleware(
  app: Express,
  routerConfigs: RouterConfig[]
) {
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.json({ limit: "50mb" }));

  const { trace } = MiddleWare.middleWares;
  app.use(trace());

  for (const cfg of routerConfigs) {
    const router = express.Router();
    for (const routeCfg of cfg.routes) {
      handleRouterMiddleware(router, routeCfg);
    }
    app.use(cfg.path, router);
  }

  const { error } = MiddleWare.middleWares;
  app.use(error());
}

export function handleRouterMiddleware(router: Router, config: RouteConfig) {
  const { method, path, middlewareConfig } = config;

  handleOptionalMiddleware(router, config);

  const catchError = (func: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await func(req, res, next);
        next();
      } catch (error) {
        next(error);
      }
    };
  };
  if (middlewareConfig.customValidate) {
    router[method](path, catchError(middlewareConfig.customValidate));
  }
  router[method](path, catchError(middlewareConfig.customHandle));
}

function handleOptionalMiddleware(router: Router, config: RouteConfig) {
  const { method, path, middlewareConfig } = config;
  const middlewares = MiddleWare.middleWares;
  const optionKeys = Object.keys(middlewareConfig.option || {});

  // 有些中间件是必须处理的，如果用户没有配置，则默认处理
  if (!optionKeys.includes("overtime")) {
    router[method](path, middlewares.overtime());
  }

  optionKeys.forEach((k: any) => {
    const handler = middlewares[k];
    if (handler) {
      router[method](path, handler(middlewareConfig.option[k]));
    }
  });
}
