import { Readable } from "stream";

export function base64ToBuffer(base64: string) {
  return Buffer.from(base64, "base64");
}

export function base64ToReadStream(base64: string) {
  return Readable.from(base64ToBuffer(base64));
}
