import corsHandler from "./corsHandler";
import traceHandler from "./traceHandler";
import overtimeHandler from "./overtimeHandler";
import authHandler from "./authHandler";
import sseHandler from "./sseHandler";
import uploadHandler from "./uploadHandler";
import errorHandler from "./errorHandler";

type Middlewares = typeof MiddleWareServer.middleWares;

type MiddlewaresKeys = keyof Middlewares;

type GetKeyParam<K extends MiddlewaresKeys> = Parameters<Middlewares[K]>[0];

export type MiddlewaresConfig = Partial<{
  [k in MiddlewaresKeys as GetKeyParam<k> extends undefined
    ? never
    : k]: GetKeyParam<k>;
}>;

export default class MiddleWareServer {
  static readonly middleWares = {
    cors: corsHandler,
    trace: traceHandler,
    auth: authHandler,
    sse: sseHandler,
    upload: uploadHandler,
    overtime: overtimeHandler,
    error: errorHandler,
  };
}
