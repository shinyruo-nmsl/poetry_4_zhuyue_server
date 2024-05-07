import { Request as _Request } from "express";
import { Role } from "./user";

export type Request = _Request & Partial<{ userId: string; role: Role }>;

export type HttpMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";
