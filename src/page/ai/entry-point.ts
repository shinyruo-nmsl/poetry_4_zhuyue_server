import { Response } from "express";
import { Request } from "@/global-type/request";
import { RouteConfig } from "@/service/middlewareService";
import { CustomError } from "@/service/errorService";
import { getAIChatStream } from "./domain";

const getGPtContentRouter: RouteConfig = {
  method: "get",
  path: "/gptContent",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary", accurate: true },
      sse: true,
      overtime: { timeout: 1000 * 60 * 3 },
    },
    customValidate(req: Request<{ query: { prompt: string } }>) {
      if (!req.query.prompt) {
        throw new CustomError("请输入提示词~", "validate");
      }
    },
    async customHandle(
      req: Request & { query: { prompt: string; serialize: boolean } },
      res: Response
    ) {
      const { serialize, prompt } = req.query;
      const stream = await getAIChatStream(req.role!, req.userId!, prompt);

      try {
        for await (const content of stream) {
          if (serialize) {
            res.write(JSON.stringify({ value: content, done: false }));
          } else {
            res.write(content);
          }
        }
        if (serialize) {
          res.write(JSON.stringify({ value: "", done: true }));
        }
        res.end();
      } catch (error) {
        throw new CustomError("gpt返回异常", "other", error);
      }
    },
  },
};

export default [getGPtContentRouter];
