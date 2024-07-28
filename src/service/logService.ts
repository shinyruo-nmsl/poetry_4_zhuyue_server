import * as Sentry from "@sentry/node";

export default class Logger {
  static init() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }

  static traceEvent(eventCallback: () => Sentry.Event) {
    // 100ms延迟, 防止某些序列化操作阻塞主线程
    setTimeout(() => {
      Sentry.captureEvent(eventCallback());
    }, 100);
  }

  static traceMessage(
    message: string,
    messageCallback?: () => Parameters<(typeof Sentry)["captureMessage"]>[1]
  ) {
    setTimeout(() => {
      if (messageCallback) {
        Sentry.captureMessage(message, messageCallback());
      } else {
        Sentry.captureMessage(message);
      }
    }, 100);
  }

  static traceError(
    err: Error,
    errCallback?: () => Parameters<(typeof Sentry)["captureException"]>[1]
  ) {
    setTimeout(() => {
      if (errCallback) {
        Sentry.captureException(err, errCallback());
      } else {
        Sentry.captureException(err);
      }
    }, 100);
  }
}
