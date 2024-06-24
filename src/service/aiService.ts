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

  static async createStream(message: string) {
    try {
      const messages = [
        {
          role: "system",
          content: "You are a helpful assistant. You will talk like a pirate.",
        },
        { role: "user", content: "Can you help me?" },
        {
          role: "assistant",
          content: "Arrrr! Of course, me hearty! What can I do for ye?",
        },
        { role: "user", content: "What's the best way to train a parrot?" },
      ];
      const stream = await this.openai.streamChatCompletions(
        "jimgpt35",
        messages,
        { maxTokens: 128 }
      );
      return new AIStream(stream);
    } catch (error) {
      // throw new CustomError("gpt连接异常", "other", error);
      throw error;
    }
  }

  static async test() {
    const { choices } = await this.openai.getCompletions(
      "jimgpt35", // assumes a matching model deployment or model name
      ["如何在nodejs里面使用azure openai"]
    );

    console.log("start");
    for (const choice of choices) {
      console.log(choice.text);
    }
    console.log("end");
  }
}

AIServer.test();

class AIStream implements AsyncIterable<string> {
  constructor(private stream: EventStream<ChatCompletions>) {}

  async *[Symbol.asyncIterator]() {
    for await (const chunk of this.stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}

// async function main() {
//   const ai = await AIServer.createStream("hello");

//   for await (const content of ai) {
//     console.log(content);
//   }
// }

// main();
