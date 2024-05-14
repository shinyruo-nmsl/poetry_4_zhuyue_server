import { createClient, RedisClientType } from "redis";

export default class RedisServer {
  private static _model: RedisClientType = createClient();
  private static connected = false;

  static async connect() {
    if (!this.connected) {
      await this._model.connect();
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
}
