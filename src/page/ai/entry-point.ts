import { Response } from "express";
import { Request } from "@/global-type/request";
import { RouteConfig } from "@/service/middlewareService";
import { CustomError } from "@/service/errorService";
import {
  AIChatMessage,
  AIImagePrompt,
  AIParseImageMessage,
} from "@/service/aiService";
import { getAIChatStream, getAIImages, getAIParseImageStream } from "./domain";

const getGPTContentRoute: RouteConfig = {
  method: "post",
  path: "/gptContent",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary", accurate: true },
      sse: true,
      overtime: { timeout: 1000 * 60 * 1 },
    },
    async customHandle(
      req: Request<{ body: { messages: AIChatMessage[]; serialize: boolean } }>,
      res: Response
    ) {
      const { serialize, messages } = req.body;
      const stream = await getAIChatStream(req.role!, req.userId!, messages);

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

const getAIImagesRoute: RouteConfig = {
  method: "post",
  path: "/images",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary", accurate: true },
      overtime: { timeout: 1000 * 60 * 3 },
    },
    async customHandle(
      req: Request<{ body: { prompt: AIImagePrompt } }>,
      res: Response
    ) {
      const { prompt } = req.body;
      const images = await getAIImages(req.role!, req.userId!, prompt);
      res.json({ images }).end();
    },
  },
};

const getAIParseImageStreamRoute: RouteConfig = {
  method: "post",
  path: "/parseImageContent",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary", accurate: true },
      sse: true,
      overtime: { timeout: 1000 * 60 * 1 },
    },
    async customHandle(
      req: Request<{
        body: { message: AIParseImageMessage; serialize: boolean };
      }>,
      res: Response
    ) {
      const { serialize, message } = req.body;
      const stream = await getAIParseImageStream(
        req.role!,
        req.userId!,
        message
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

export default [
  getGPTContentRoute,
  getAIImagesRoute,
  getAIParseImageStreamRoute,
];
