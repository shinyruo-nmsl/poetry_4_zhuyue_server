import { Request as _Request } from "express";
import { UploadFile } from "@/service/fileService";
import { Role } from "./user";

export type Request<
  T extends Partial<{ body: any; query: any; params: any }> = {}
> = _Request<T["params"], any, T["body"], T["query"]> & {
  traceID: string;
} & Partial<{
    userId: string;
    role: Role;
    file: UploadFile;
  }>;

export type HttpMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";
