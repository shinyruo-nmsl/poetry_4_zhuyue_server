import express, {
  Express,
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import bodyParser from "body-parser";
import {
  getDefaultMiddlewares,
  getOptionalMiddlewares,
  OptionalMiddlewareOption,
} from "../middleware";
import { HttpMethod } from "../global-type/request";

export type RouteConfig = {
  method: HttpMethod;
  path: string;
  middlewareConfig: {
    option: OptionalMiddlewareOption;
    customValidate?: (req: Request, res: Response, next: NextFunction) => void;
    customHandle(req: Request, res: Response, next: NextFunction): void;
  };
};

export type RouterConfig = {
  path: string;
  routes: RouteConfig[];
};

export default function handleMiddleware(
  app: Express,
  routerConfigs: RouterConfig[]
) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  for (const cfg of routerConfigs) {
    const router = express.Router();
    for (const routeCfg of cfg.routes) {
      handleRouterMiddleware(router, routeCfg);
    }
    app.use(cfg.path, router);
  }

  const { errorHandler } = getDefaultMiddlewares();
  app.use(errorHandler);
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
  const middlewares = getOptionalMiddlewares();

  const optionKeys = Object.keys(middlewareConfig.option);

  // 如果需要登录，先走登录再走鉴权
  const loginIndex = optionKeys.findIndex((k) => k === "login");
  const authIndex = optionKeys.findIndex((k) => k === "auth");
  if (loginIndex > -1 && authIndex > -1 && loginIndex > authIndex) {
    [optionKeys[loginIndex], optionKeys[authIndex]] = [
      optionKeys[authIndex],
      optionKeys[loginIndex],
    ];
  }

  optionKeys.forEach((k: any) => {
    const handler = middlewares[k];
    if (handler) {
      router[method](path, handler(middlewareConfig.option[k]));
    }
  });
}
