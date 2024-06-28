import {
  OpenAIClient,
  AzureKeyCredential,
  EventStream,
  ChatCompletions,
} from "@azure/openai";
import { CustomError } from "./errorService";

export type AIRole = "user" | "assistant";

export type AIChatMessage = {
  role: AIRole;
  content: string;
};

export class AIServer {
  private static openai = new OpenAIClient(
    process.env.AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_OPENAI_SECRET_KEY)
  );

  static async createStream(messages: AIChatMessage[]) {
    if (messages.length === 0) {
      throw new CustomError("请输入消息~", "validate");
    }

    if (messages.length > 4) {
      throw new CustomError("请求消息过多", "validate");
    }

    try {
      const stream = await this.openai.streamChatCompletions(
        "jimgpt4o",
        messages
      );
      return new AIStream(stream);
    } catch (error) {
      throw new CustomError("gpt连接异常", "other", error);
    }
  }
}
class AIStream implements AsyncIterable<string> {
  constructor(private stream: EventStream<ChatCompletions>) {}

  async *[Symbol.asyncIterator]() {
    for await (const chunk of this.stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
