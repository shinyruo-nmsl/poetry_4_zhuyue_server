import { Response } from "express";
import { Request } from "@/global-type/request";
import { RouteConfig } from "@/service/middlewareService";
import { CustomError } from "@/service/errorService";
import { AIChatMessage } from "@/service/aiService";
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
    async customHandle(
      req: Request & {
        query: { messages: string; serialize: boolean };
      },
      res: Response
    ) {
      const { serialize, messages } = req.query;
      const stream = await getAIChatStream(
        req.role!,
        req.userId!,
        JSON.parse(messages) as AIChatMessage[]
      );

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
