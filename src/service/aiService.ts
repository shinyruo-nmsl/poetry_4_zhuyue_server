import {
  OpenAIClient,
  AzureKeyCredential,
  EventStream,
  ChatCompletions,
} from "@azure/openai";
import { CustomError } from "./errorService";

export enum AIMODEL {
  GPT = "jimgpt4o",
  DALL_E = "jimdall-e",
}

export type AIRole = "user" | "assistant";

export type AIChatMessage = {
  role: AIRole;
  content: string;
};

export type AIImagePrompt = {
  prompt: string;
  count: number;
};

export type AIParseImageMessage = {
  description: string;
  imgUrl: string;
};

export class AIServer {
  private static openai = new OpenAIClient(
    process.env.AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_OPENAI_SECRET_KEY)
  );

  static async createGPTStream(messages: AIChatMessage[]) {
    if (messages.length === 0) {
      throw new CustomError("请输入消息~", "validate");
    }

    if (messages.length > 4) {
      throw new CustomError("请求消息过多", "validate");
    }

    try {
      const stream = await this.openai.streamChatCompletions(
        AIMODEL.GPT,
        messages
      );
      return new GPTStream(stream);
    } catch (error) {
      throw new CustomError("gpt连接异常", "other", error);
    }
  }

  static async createImages(prompt: AIImagePrompt) {
    if (prompt.prompt.length === 0) {
      throw new CustomError("请输入描述~", "validate");
    }

    if (prompt.count === 0) {
      throw new CustomError("请输入生成图片数量~", "validate");
    }

    if (prompt.count > 5) {
      throw new CustomError("请求图片过多", "validate");
    }

    try {
      const res = await this.openai.getImages(AIMODEL.DALL_E, prompt.prompt, {
        n: prompt.count,
        size: "1024x1024",
        quality: "standard",
      });

      return res.data.map((item) => item.url);
    } catch (error) {
      throw new CustomError("dall-e连接异常", "other", error);
    }
  }

  static async createParseImageStream(message: AIParseImageMessage) {
    try {
      const stream = await this.openai.streamChatCompletions(AIMODEL.GPT, [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message.description,
            },
            {
              type: "image_url",
              imageUrl: {
                url: message.imgUrl,
              },
            },
          ],
        },
      ]);
      return new GPTStream(stream);
    } catch (error) {
      throw error;
    }
  }
}
class GPTStream implements AsyncIterable<string> {
  constructor(private stream: EventStream<ChatCompletions>) {}

  async *[Symbol.asyncIterator]() {
    for await (const chunk of this.stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
