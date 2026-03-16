// 日志级别
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

// 日志条目接口
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
  userId?: string;
}

// 日志配置
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  userId?: string;
}

// 默认配置
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: false,
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // 设置配置
  configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  // 主日志方法
  private log(entry: LogEntry) {
    // 检查日志级别
    if (!this.shouldLog(entry.level)) {
      return;
    }

    // 控制台输出
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // 远程日志
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.logToRemote(entry).catch((err) => {
        console.error("Failed to send logs to remote:", err);
      });
    }

    // 存储到本地存储（用于调试）
    if (typeof window !== "undefined" && entry.level === LogLevel.ERROR) {
      this.storeErrorLocally(entry);
    }
  }

  // 判断是否应该记录日志
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.config.minLevel);
  }

  // 控制台日志
  private logToConsole(entry: LogEntry) {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(prefix, entry.message, entry.context || "");
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context || "");
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.error || "", entry.context || "");
        break;
    }
  }

  // 远程日志
  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // 避免日志记录本身产生错误循环
      console.error("Failed to send log to remote:", error);
    }
  }

  // 本地存储错误（用于调试）
  private storeErrorLocally(entry: LogEntry) {
    try {
      const errors = this.getLocalErrors();
      errors.push(entry);

      // 只保留最近50个错误
      const recentErrors = errors.slice(-50);

      localStorage.setItem("app_errors", JSON.stringify(recentErrors));
    } catch (error) {
      // 忽略存储错误
    }
  }

  // 获取本地存储的错误
  getLocalErrors(): LogEntry[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("app_errors");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  // 清除本地错误
  clearLocalErrors() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_errors");
    }
  }

  // 便捷方法
  debug(message: string, context?: Record<string, unknown>) {
    this.log({ level: LogLevel.DEBUG, message, timestamp: new Date(), context });
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log({ level: LogLevel.INFO, message, timestamp: new Date(), context });
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log({ level: LogLevel.WARN, message, timestamp: new Date(), context });
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      error,
      context,
    });
  }

  // 带用户ID的日志
  setUserContext(userId: string) {
    this.config.userId = userId;
  }

  clearUserContext() {
    delete this.config.userId;
  }
}

// 创建单例实例
const logger = new Logger();

// 导出实例和类型
export default logger;
export { Logger };
export type { LogEntry, LoggerConfig };
