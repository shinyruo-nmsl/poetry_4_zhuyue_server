import * as Sentry from "@sentry/node";

export default class Logger {
  static init() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }

  static traceEvent(event: Sentry.Event) {
    return Sentry.captureEvent(event);
  }

  static traceMessage(
    ...params: Parameters<(typeof Sentry)["captureMessage"]>
  ) {
    return Sentry.captureMessage(...params);
  }

  static traceError(
    ...params: Parameters<(typeof Sentry)["captureException"]>
  ) {
    return Sentry.captureException(...params);
  }
}
