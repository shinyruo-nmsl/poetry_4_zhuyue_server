import { Response } from "express";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { CustomError } from "../../service/errorService";
import { getAIChatStream } from "./domain";

const getGPtContentRouter: RouteConfig = {
  method: "get",
  path: "/gptContent",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
      sse: true,
      overtime: { timeout: 1000 * 60 * 3 },
    },
    customValidate(req: Request & { query: { prompt: string } }) {
      if (!req.query.prompt) {
        throw new CustomError("请输入提示词~", "validate");
      }
    },
    async customHandle(
      req: Request & { query: { prompt: string } },
      res: Response
    ) {
      try {
        const stream = await getAIChatStream(req.role!, req.query.prompt);
        for await (const content of stream) {
          res.write(content);
        }
        res.end();
      } catch (error) {
        throw new CustomError("gpt连接异常", "other");
      }
    },
  },
};

export default [getGPtContentRouter];
