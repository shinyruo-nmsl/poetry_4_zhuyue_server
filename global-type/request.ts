import { Request as _Request } from "express";
import { Role } from "./user";

export type Request<T extends Partial<{ body: any; query: any }> = {}> =
  _Request<any, any, T["body"], T["query"]> &
    Partial<{ userId: string; role: Role }>;

export type HttpMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";
