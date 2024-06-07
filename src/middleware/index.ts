import traceHandler from "./traceHandler";
import overtimeHandler from "./overtimeHandler";
import authHandler from "./authHandler";
import sseHandler from "./sseHandler";
import errorHandler from "./errorHandler";

export default class MiddleWare {
  static readonly middleWares = {
    trace: traceHandler,
    auth: authHandler,
    sse: sseHandler,
    overtime: overtimeHandler,
    error: errorHandler,
  };
}

type Middlewares = typeof MiddleWare.middleWares;
type MiddlewaresKeys = keyof Middlewares;
type GetKeyParam<K extends MiddlewaresKeys> = Parameters<Middlewares[K]>[0];
export type MiddlewaresConfig = Partial<{
  [k in MiddlewaresKeys as GetKeyParam<k> extends undefined
    ? never
    : k]: GetKeyParam<k>;
}>;
