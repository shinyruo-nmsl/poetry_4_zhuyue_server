import OpenAI from "openai";

export class AIServer {
  private static openai = new OpenAI({ apiKey: "ddddsscscs" });

  static async createStream(message: string) {
    const stream = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      stream: true,
    });
    return new AIStream(stream);
  }

  static async createTestStream(message: string) {
    return new AIStreamTest();
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

function sleep(val): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(val), 1000));
}

class AIStreamTest implements AsyncIterable<string> {
  async *[Symbol.asyncIterator]() {
    yield sleep("你好");
    yield sleep("我是ai机器人"),
      yield sleep(
        "fjsdfjwdjfklkadlkasjdkasjdkasjdkasjdkasjdkasjdaksjdaksdjaksjdaskdjaskldjasdasdas"
      );
  }
}
