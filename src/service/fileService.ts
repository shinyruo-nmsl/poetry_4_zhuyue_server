import { Readable } from "stream";
import multer from "multer";

export function base64ToBuffer(base64: string) {
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(data, "base64");
}

export function base64ToReadStream(base64: string) {
  return Readable.from(base64ToBuffer(base64));
}

export function base64toFile(base64: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], "", { type: mime });
}

export type UploadOptions = Exclude<multer.Options, "storage">;

export type UploadFile = Express.Multer.File;
export class UploadServer {
  private static storage = multer.memoryStorage();

  static createUploadMiddleware(config: UploadOptions) {
    return multer({ storage: this.storage, ...config });
  }
}
