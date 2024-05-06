export type ErrorCode = "database" | "validate" | "auth" | "other";

export class CustomError extends Error {
  constructor(message: string, private code: ErrorCode, private text?: string) {
    super(message);
  }

  get errorCode() {
    return this.code;
  }

  get errorText() {
    return this.text;
  }
}
