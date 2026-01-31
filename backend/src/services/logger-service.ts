export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  meta?: Record<string, unknown>;
}

export interface LoggerInterface {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export class LoggerService implements LoggerInterface {
  private static instance: LoggerService;
  private level: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog(LogLevel.DEBUG, message, meta);
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog(LogLevel.INFO, message, meta);
    }
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.writeLog(LogLevel.WARN, message, meta);
    }
  }

  error(message: string, meta?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.writeLog(LogLevel.ERROR, message, meta);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
    ];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private writeLog(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString();
    const service = this.getCallerService();

    const logEntry: LogEntry = {
      timestamp,
      level,
      service,
      message,
      meta,
    };

    // Store in memory
    this.logs.push(logEntry);

    // Output to console
    this.outputLog(logEntry);

    // Potentially send to external logging service
    this.sendToExternalLogger(logEntry);
  }

  private getCallerService(): string {
    // In a real implementation, this would use stack traces to determine
    // which service/module is calling the logger
    return "unknown";
  }

  private outputLog(entry: LogEntry): void {
    const formattedMessage = `[${
      entry.timestamp
    }] [${entry.level.toUpperCase()}] [${entry.service}] ${entry.message}`;

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.meta);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.meta);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.meta);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.meta);
        break;
    }
  }

  private sendToExternalLogger(entry: LogEntry): void {
    // In a real implementation, this would send logs to external services
    // like Sentry, DataDog, etc. based on configuration
  }

  getRecentLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Convenience function for quick logging
export const logger = LoggerService.getInstance();
