import { createClient, RedisClientType } from "redis";

export default class RedisServer {
  private static _model: RedisClientType = createClient();
  private static connected = false;

  static async connect() {
    if (!this.connected) {
      await this._model.connect();
      console.log("redis connected successfully");
    }
    this.connected = true;
  }

  static async getModel() {
    await this.connect();
    return this._model;
  }

  static async set(...params: Parameters<RedisClientType["set"]>) {
    await this.connect();
    return this._model.set(...params);
  }

  static async get(...params: Parameters<RedisClientType["get"]>) {
    await this.connect();
    return this._model.get(...params);
  }

  static async expireAt(...params: Parameters<RedisClientType["expireAt"]>) {
    await this.connect();
    return this._model.expireAt(...params);
  }

  static async expire(...params: Parameters<RedisClientType["expire"]>) {
    await this.connect();
    return this._model.expire(...params);
  }

  static async incr(...params: Parameters<RedisClientType["incr"]>) {
    await this.connect();
    return this._model.incr(...params);
  }

  static async limitCount(
    key: string,
    count: number,
    expireAt: Date
  ): Promise<{ status: "reject" | "resolve"; count: number }>;
  static async limitCount(
    key: string,
    count: number,
    expireDelay: number
  ): Promise<{ status: "reject" | "resolve"; count: number }>;
  static async limitCount(key: string, count: number, expire: Date | number) {
    const curCount = await this.incr(key);
    if (curCount > count) {
      return {
        status: "reject",
        count: curCount,
      };
    } else if (curCount === 1) {
      if (expire instanceof Date) {
        await this.expireAt(key, expire);
      } else {
        await this.expire(key, expire);
      }
    }
    return {
      status: "resolve",
      count: curCount,
    };
  }
}
