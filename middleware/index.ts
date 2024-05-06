import authHandler from "./authHandler";
import errorHandler from "./errorHandler";

const Optional_Middleware_Map = {
  auth: (need: true) => authHandler,
};

const Default_Middleware_Map = {
  errorHandler,
};

export type OptionalMiddlewares = typeof Optional_Middleware_Map;

export type OptionalMiddlewareKeys = keyof OptionalMiddlewares;

export type OptionalMiddlewareOption = Partial<{
  [k in OptionalMiddlewareKeys]: Parameters<OptionalMiddlewares[k]>[0];
}>;

// 可选的中间件
export function getOptionalMiddlewares() {
  return Optional_Middleware_Map;
}

// 默认的中间件
export function getDefaultMiddlewares() {
  return Default_Middleware_Map;
}
