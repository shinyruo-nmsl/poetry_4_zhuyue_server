import { Response } from "express";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { CustomError } from "../../service/errorService";
import { getAIChatStream } from "./domain";

const getGPtContentRouter: RouteConfig = {
  method: "get",
  path: "/gptContent",
  middlewareConfig: {
    option: { sse: true },
    async customHandle(
      req: Request & { query: { prompt: string } },
      res: Response
    ) {
      const stream = await getAIChatStream(req.role!, req.query.prompt);

      for await (const content of stream) {
        res.write(content);
      }
      res.end();
    },
  },
};

export default [getGPtContentRouter];
