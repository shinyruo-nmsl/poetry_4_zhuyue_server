import { Request, Response, NextFunction } from "express";

import errorHandler from "./errorHandler";

const Optional_Middleware_Map = {
  zz: (a: number) => (req: Request, res: Response, next: NextFunction) => {
    console.log("金雪");
    next();
  },
  xx:
    (b: string, c: boolean) =>
    (req: Request, res: Response, next: NextFunction) => {
      console.log("eee");
      next();
    },
};

const Default_Middleware_Map = {
  errorHandler,
};

export type OptionalMiddlewares = typeof Optional_Middleware_Map;

export type OptionalMiddlewareKeys = keyof OptionalMiddlewares;

export type OptionalMiddlewareOption = Partial<{
  [k in OptionalMiddlewareKeys]: Parameters<OptionalMiddlewares[k]>;
}>;

// 可选的中间件
export function getOptionalMiddlewares() {
  return Optional_Middleware_Map;
}

// 默认的中间件
export function getDefaultMiddlewares() {
  return Default_Middleware_Map;
}
