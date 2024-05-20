export type ErrorCode =
  | "database"
  | "validate"
  | "auth"
  | "login"
  | "overtime"
  | "other";

export class CustomError extends Error {
  constructor(
    message: string,
    private code: ErrorCode,
    public error?: Error,
    private text?: string
  ) {
    super(message);
  }

  get errorCode() {
    return this.code;
  }

  get errorText() {
    return this.text;
  }
}
