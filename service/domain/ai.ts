import OpenAI from "openai";
import { CustomError } from "../errorService";

export class AIServer {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  static async createStream(message: string) {
    try {
      const stream = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        stream: true,
      });
      return new AIStream(stream);
    } catch (err) {
      throw new CustomError("gpt连接异常", "other");
    }
  }
}

type OpenAIStream = Exclude<
  Awaited<ReturnType<OpenAI["chat"]["completions"]["create"]>>,
  OpenAI.Chat.Completions.ChatCompletion
>;

class AIStream implements AsyncIterable<string> {
  constructor(private stream: OpenAIStream) {}

  async *[Symbol.asyncIterator]() {
    for await (const chunk of this.stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
