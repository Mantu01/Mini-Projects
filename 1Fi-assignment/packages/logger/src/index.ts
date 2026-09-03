export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

const DEFAULT_OPTIONS: Required<LoggerOptions> = {
  level: "info",
  prefix: "",
};

export function createLogger(options: LoggerOptions = {}) {
  const { level, prefix } = { ...DEFAULT_OPTIONS, ...options };

  function log(
    logLevel: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
  ): void {
    if (LEVEL_ORDER[logLevel] < LEVEL_ORDER[level]) return;

    const timestamp = new Date().toISOString();
    const prefixStr = prefix ? `[${prefix}]` : "";
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";

    const line = `${timestamp} ${prefixStr} [${logLevel.toUpperCase()}] ${message}${metaStr}`;

    switch (logLevel) {
      case "error":
        console.error(line);
        break;
      case "warn":
        console.warn(line);
        break;
      default:
        console.log(line);
    }
  }

  return {
    debug: (message: string, meta?: Record<string, unknown>) =>
      log("debug", message, meta),
    info: (message: string, meta?: Record<string, unknown>) =>
      log("info", message, meta),
    warn: (message: string, meta?: Record<string, unknown>) =>
      log("warn", message, meta),
    error: (message: string, meta?: Record<string, unknown>) =>
      log("error", message, meta),
  };
}

export const logger = createLogger();
