export type ErrorCode = "database" | "validate";

export class CustomError extends Error {
  constructor(message: string, private code: ErrorCode) {
    super(message);
  }

  get errorCode() {
    return this.code;
  }
}
