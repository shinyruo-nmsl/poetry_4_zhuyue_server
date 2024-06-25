import {
  OpenAIClient,
  AzureKeyCredential,
  EventStream,
  ChatCompletions,
} from "@azure/openai";
import { CustomError } from "./errorService";

export class AIServer {
  private static openai = new OpenAIClient(
    process.env.AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_OPENAI_SECRET_KEY)
  );

  static async createStream(prompt: string) {
    try {
      const messages = [{ role: "user", content: prompt }];
      const stream = await this.openai.streamChatCompletions(
        "jimgpt35",
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
