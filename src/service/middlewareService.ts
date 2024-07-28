import express, { Express, Router, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { Request } from "@/global-type/request";
import { HttpMethod } from "@/global-type/request";
import MiddleWareServer, { MiddlewaresConfig } from "@/middleware";

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
  const { cors, error } = MiddleWareServer.middleWares;

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.json({ limit: "50mb" }));

  for (const cfg of routerConfigs) {
    const router = express.Router();
    for (const routeCfg of cfg.routes) {
      handleRouterMiddleware(router, routeCfg);
    }
    app.use(cfg.path, router);
  }

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
  const middlewares = MiddleWareServer.middleWares;
  const optionKeys = Object.keys(middlewareConfig.option || {});

  // 如果没有设置权限，则在这里运行trace
  if (!optionKeys.includes("auth")) {
    router[method](path, middlewares.trace());
  }

  // 如果没有配置超时限制，则默认处理
  if (!optionKeys.includes("overtime")) {
    router[method](path, middlewares.overtime());
  }

  optionKeys.forEach((k: any) => {
    const handler = middlewares[k];
    if (handler) {
      router[method](path, handler(middlewareConfig.option[k]));
    }
  });

  // 如果设置了权限，则在这里运行trace，目的是为了获取userID
  if (optionKeys.includes("auth")) {
    router[method](path, middlewares.trace());
  }
}
